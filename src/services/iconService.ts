import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

export class IconService {
  private readonly websiteDir: string;

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

      // 尝试获取图标
      const iconUrl = await this.findIconUrl(url);

      if (iconUrl) {
        const response = await axios.get(iconUrl, {
          responseType: 'arraybuffer'
        });

        // 获取内容类型
        const contentType = response.headers['content-type'] || 'image/x-icon';

        // 保存到缓存
        fs.writeFileSync(iconPath, response.data);

        return {
          buffer: Buffer.from(response.data),
          contentType
        };
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

      // 1. 首先尝试获取页面 HTML
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      // 2. 查找 link 标签中的图标
      const iconSelectors = [
        'link[rel="icon"]',
        'link[rel="shortcut icon"]',
        'link[rel="apple-touch-icon"]',
        'link[rel="apple-touch-icon-precomposed"]'
      ];

      for (const selector of iconSelectors) {
        const iconElement = $(selector).first();
        if (iconElement.length) {
          const href = iconElement.attr('href');
          if (href) {
            return href.startsWith('http') ? href : new URL(href, baseUrl).href;
          }
        }
      }

      // 3. 如果没找到，尝试默认的 favicon.ico 位置
      const faviconUrl = `${baseUrl}/favicon.ico`;
      const faviconResponse = await axios.head(faviconUrl);
      if (faviconResponse.status === 200) {
        return faviconUrl;
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}