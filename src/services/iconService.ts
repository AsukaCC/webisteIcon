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

      // 1. 首先尝试从 HTML 中获取
      const iconUrl = await this.findIconUrl(url);
      if (iconUrl) {
        try {
          const response = await axios.get(iconUrl, {
            ...this.axiosConfig,
            responseType: 'arraybuffer'
          });

          fs.writeFileSync(iconPath, response.data);
          return {
            buffer: Buffer.from(response.data),
            contentType: response.headers['content-type'] || 'image/x-icon'
          };
        } catch (error) {
          console.log('从HTML获取图标失败，尝试其他方式');
        }
      }

      // 2. 尝试直接获取 favicon.ico
      const faviconUrls = [
        `https://${mainDomain}/favicon.ico`,
        `https://www.${mainDomain}/favicon.ico`
      ];

      for (const faviconUrl of faviconUrls) {
        try {
          const response = await axios.get(faviconUrl, {
            ...this.axiosConfig,
            responseType: 'arraybuffer'
          });

          if (response.status === 200 && response.data.length > 0) {
            fs.writeFileSync(iconPath, response.data);
            return {
              buffer: Buffer.from(response.data),
              contentType: response.headers['content-type'] || 'image/x-icon'
            };
          }
        } catch (error) {
          continue;
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

  private async findIconUrl(url: string): Promise<string | null> {
    try {
      const baseUrl = new URL(url).origin;
      const response = await axios.get(url, this.axiosConfig);
      const html = response.data;
      const $ = cheerio.load(html);

      const iconSelectors = [
        'link[rel="icon"]',
        'link[rel="shortcut icon"]',
        'link[rel="apple-touch-icon"]',
        'link[rel="apple-touch-icon-precomposed"]',
        'link[rel="mask-icon"]',
        'meta[property="og:image"]'
      ];

      for (const selector of iconSelectors) {
        const iconElement = $(selector).first();
        if (iconElement.length) {
          const href = iconElement.attr('href') || iconElement.attr('content');
          if (href) {
            return href.startsWith('http') ? href : new URL(href, baseUrl).href;
          }
        }
      }

      return null;
    } catch (error) {
      console.log('解析HTML失败，尝试直接获取favicon.ico');
      return null;
    }
  }
}