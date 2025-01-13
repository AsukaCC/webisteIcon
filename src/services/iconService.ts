import axios from 'axios';
import * as cheerio from 'cheerio';

interface IconResult {
  buffer: Buffer;
  contentType: string;
  iconUrl: string;
}

interface IconLink {
  selector: string;
  href: string;
}

export class IconService {
  private readonly iconSelectors = [
    'link[rel="apple-touch-icon"]',
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="mask-icon"]',
    'meta[property="og:image"]',
    'meta[property="twitter:image"]',
  ];

  private readonly axiosConfig = {
    timeout: 5000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      Accept: 'text/html,application/xhtml+xml,*/*',
    },
    maxRedirects: 5,
  };

  async getIcon(url: string, mainDomain: string): Promise<IconResult> {
    try {
      url = url.replace(/^(https?:\/\/)+/, ''); // 去除已有的 http 或 https
      console.log('\n=== 开始获取图标 ===');
      console.log('URL:', url);

      const iconLinks = await this.findIconLinks(url);

      if (iconLinks.length > 0) {
        const firstIcon = iconLinks[0];
        try {
          const response = await axios.get(firstIcon.href, {
            ...this.axiosConfig,
            responseType: 'arraybuffer',
          });

          console.log('✓ 成功获取图标:', firstIcon.href);
          return {
            buffer: Buffer.from(response.data),
            contentType: response.headers['content-type'] || 'image/x-icon',
            iconUrl: firstIcon.href,
          };
        } catch (error) {
          console.log('✗ 无法获取首选图标');
          throw new Error('USE_DEFAULT_ICON');
        }
      }

      // 如果没有找到图标，抛出特定错误
      throw new Error('USE_DEFAULT_ICON');
    } catch (error) {
      if (error instanceof Error && error.message === 'USE_DEFAULT_ICON') {
        throw error;
      }
      console.error(
        '获取图标失败:',
        error instanceof Error ? error.message : '未知错误'
      );
      throw new Error('USE_DEFAULT_ICON');
    }
  }

  private async findIconLinks(url: string): Promise<IconLink[]> {
    try {
      const response = await axios.get(url, this.axiosConfig);
      const baseUrl = new URL(url).origin;
      const $ = cheerio.load(response.data);
      const links: IconLink[] = [];

      for (const selector of this.iconSelectors) {
        $(selector).each((_, el) => {
          const $el = $(el);
          const href = $el.attr('href') || $el.attr('content');

          if (href) {
            const fullUrl = href.startsWith('http')
              ? href
              : new URL(href, baseUrl).href;
            links.push({
              selector,
              href: fullUrl,
            });
          }
        });
      }

      if (links.length > 0) {
        console.log('\n找到的图标链接:');
        links.forEach((link, index) => {
          console.log(`${index + 1}. ${link.selector}\n   ${link.href}`);
        });
      } else {
        console.log('未在页面中找到图标链接');
      }

      return Array.from(
        new Map(links.map((link) => [link.href, link])).values()
      );
    } catch (error) {
      console.error(
        '解析页面失败:',
        error instanceof Error ? error.message : '未知错误'
      );
      return [];
    }
  }
}
