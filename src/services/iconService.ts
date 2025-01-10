import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

export class IconService {
  private readonly websiteDir: string;
  private readonly axiosConfig = {
    timeout: 5000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  };

  // 图标选择器列表，按优先级排序
  private readonly iconSelectors = [
    // 标准图标
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    // 苹果设备图标
    'link[rel="apple-touch-icon"]',
    'link[rel="apple-touch-icon-precomposed"]',
    // Safari 特定图标
    'link[rel="mask-icon"]',
    // 社交媒体图标
    'meta[property="og:image"]',
    'meta[name="twitter:image"]',
    // 其他常见图标
    'link[rel="fluid-icon"]',
    'link[rel="image_src"]'
  ];

  // 常见的图标路径
  private readonly commonIconPaths = [
    '/favicon.ico',
    '/favicon.png',
    '/favicon-32x32.png',
    '/favicon-16x16.png',
    '/apple-touch-icon.png',
    '/apple-touch-icon-precomposed.png',
    '/icon.png',
    '/icon.ico'
  ];

  constructor() {
    this.websiteDir = path.join(process.cwd(), 'website');
    if (!fs.existsSync(this.websiteDir)) {
      fs.mkdirSync(this.websiteDir, { recursive: true });
    }
  }

  async getIcon(url: string, mainDomain: string): Promise<{
    buffer: Buffer;
    contentType: string;
  }> {
    try {
      const iconPath = path.join(this.websiteDir, `${mainDomain}.ico`);

      // 如果缓存存在，直接返回
      if (fs.existsSync(iconPath)) {
        return {
          buffer: fs.readFileSync(iconPath),
          contentType: 'image/x-icon'
        };
      }

      // 1. 尝试从 HTML 中获取图标
      const iconData = await this.findIconFromHtml(url);
      if (iconData) {
        fs.writeFileSync(iconPath, iconData.buffer);
        return iconData;
      }

      // 2. 尝试常见的图标路径
      const baseUrl = new URL(url).origin;
      const domains = [
        baseUrl,
        `https://www.${mainDomain}`,
        `https://${mainDomain}`
      ];

      for (const domain of domains) {
        for (const iconPath of this.commonIconPaths) {
          try {
            const response = await axios.get(`${domain}${iconPath}`, {
              ...this.axiosConfig,
              responseType: 'arraybuffer'
            });

            if (response.status === 200 && response.data.length > 0) {
              fs.writeFileSync(iconPath, response.data);
              return {
                buffer: Buffer.from(response.data),
                contentType: response.headers['content-type'] || this.getContentType(iconPath)
              };
            }
          } catch (error) {
            continue;
          }
        }
      }

      throw new Error('未找到图标');
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`获取图标失败: ${error.message}`);
      }
      throw new Error('获取图标失败');
    }
  }

  private async findIconFromHtml(url: string): Promise<{ buffer: Buffer; contentType: string; } | null> {
    try {
      const baseUrl = new URL(url).origin;
      const response = await axios.get(url, this.axiosConfig);
      const html = response.data;
      const $ = cheerio.load(html);

      // 遍历所有可能的图标选择器
      for (const selector of this.iconSelectors) {
        const elements = $(selector);
        for (const element of elements.toArray()) {
          const $element = $(element);
          const href = $element.attr('href') ||
                      $element.attr('content') ||
                      $element.attr('src');

          if (href) {
            try {
              const iconUrl = href.startsWith('http') ? href : new URL(href, baseUrl).href;
              const response = await axios.get(iconUrl, {
                ...this.axiosConfig,
                responseType: 'arraybuffer'
              });

              if (response.status === 200 && response.data.length > 0) {
                const sizes = $element.attr('sizes');
                // 优先选择较大尺寸的图标
                if (!sizes || parseInt(sizes.split('x')[0]) >= 16) {
                  return {
                    buffer: Buffer.from(response.data),
                    contentType: response.headers['content-type'] || this.getContentType(href)
                  };
                }
              }
            } catch (error) {
              continue;
            }
          }
        }
      }

      return null;
    } catch (error) {
      console.log('解析HTML失败，尝试直接获取favicon.ico');
      return null;
    }
  }

  private getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const contentTypes: { [key: string]: string } = {
      '.ico': 'image/x-icon',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif'
    };
    return contentTypes[ext] || 'image/x-icon';
  }
}