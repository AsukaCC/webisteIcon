import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

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

  async getIcon(
    cleanedUrl: string,
    mainDomain: string
  ): Promise<IconResult | null> {
    try {
      // 前置缓存查询
      const cachedFilePath = this.getCachedIconPath(cleanedUrl);
      if (cachedFilePath) {
        console.log(`从缓存中加载图标: ${cachedFilePath}`);
        return {
          buffer: fs.readFileSync(cachedFilePath),
          contentType: this.getContentTypeFromFileName(cachedFilePath),
          iconUrl: cachedFilePath,
        };
      }

      const iconLinks = await this.findIconLinks(mainDomain);

      if (iconLinks.length > 0) {
        const firstIcon = iconLinks[0];
        try {
          const response = await axios.get(firstIcon.href, {
            ...this.axiosConfig,
            responseType: 'arraybuffer',
          });

          console.log('✓ 成功获取图标:', firstIcon.href);

          const iconBuffer = Buffer.from(response.data);
          const contentType =
            response.headers['content-type'] || 'image/x-icon';

          this.saveIconToFile(cleanedUrl, iconBuffer, contentType);

          return {
            buffer: iconBuffer,
            contentType,
            iconUrl: firstIcon.href,
          };
        } catch (error) {
          console.log('✗ 无法获取首选图标');
          return null; // 图标获取失败，返回 null
        }
      }

      console.log('未在页面中找到图标链接或无法获取图标，使用默认路径');
      const defaultIconUrl = new URL('/favicon.ico', mainDomain).href;
      try {
        const response = await axios.get(defaultIconUrl, {
          ...this.axiosConfig,
          responseType: 'arraybuffer',
        });

        const iconBuffer = Buffer.from(response.data);
        const contentType = response.headers['content-type'] || 'image/x-icon';

        this.saveIconToFile(cleanedUrl, iconBuffer, contentType);

        return {
          buffer: iconBuffer,
          contentType,
          iconUrl: defaultIconUrl,
        };
      } catch (error) {
        console.log('默认路径也无法获取图标');
        return null; // 默认路径图标获取失败，返回 null
      }
    } catch (error) {
      console.error(
        '获取图标失败:',
        error instanceof Error ? error.message : '未知错误'
      );
      return null; // 出现任何错误时，返回 null
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

  private saveIconToFile(
    cleanedUrl: string,
    buffer: Buffer,
    contentType: string
  ): void {
    try {
      const extension = this.getExtensionFromContentType(contentType);
      const fileName = `${cleanedUrl.replace(
        /[^a-zA-Z0-9]/g,
        '_'
      )}.${extension}`;
      const filePath = path.join('website', fileName);

      // 确保文件夹存在
      fs.mkdirSync('website', { recursive: true });

      // 写入文件
      fs.writeFileSync(filePath, buffer);
      console.log(`图标已保存到: ${filePath}`);
    } catch (error) {
      console.error(
        '保存图标失败:',
        error instanceof Error ? error.message : '未知错误'
      );
    }
  }

  private getCachedIconPath(cleanedUrl: string): string | null {
    try {
      const fileNamePrefix = `${cleanedUrl.replace(/[^a-zA-Z0-9]/g, '_')}.`;
      const filePath = path.join('website');
      const files = fs.readdirSync(filePath);

      const cachedFile = files.find((file) => file.startsWith(fileNamePrefix));
      return cachedFile ? path.join(filePath, cachedFile) : null;
    } catch {
      return null;
    }
  }

  private getExtensionFromContentType(contentType: string): string {
    switch (contentType) {
      case 'image/png':
        return 'png';
      case 'image/jpeg':
        return 'jpg';
      case 'image/x-icon':
      case 'image/vnd.microsoft.icon':
        return 'ico';
      case 'image/svg+xml':
        return 'svg';
      default:
        return 'bin';
    }
  }

  private getContentTypeFromFileName(fileName: string): string {
    const extension = path.extname(fileName).toLowerCase();
    switch (extension) {
      case '.png':
        return 'image/png';
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.ico':
        return 'image/x-icon';
      case '.svg':
        return 'image/svg+xml';
      default:
        return 'application/octet-stream';
    }
  }
}
