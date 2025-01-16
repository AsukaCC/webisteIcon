import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

interface IconResult {
  buffer: Buffer;
  contentType: string;
  iconUrl: string;
}

interface IconLink {
  selector: string;
  href: string;
}

interface IconCache {
  buffer: Buffer;
  contentType: string;
  timestamp: number;
}

export class IconService {
  private readonly CACHE_EXPIRY_HOURS = 48;
  private readonly iconSelectors = [
    'link[rel="apple-touch-icon"]',
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="mask-icon"]',
    'meta[property="og:image"]',
    'meta[property="twitter:image"]',
  ];

  private getAxiosConfig(url: string) {
    const parsedUrl = new URL(url);
    return {
      timeout: 10000,
      headers: {
        accept:
          'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        'sec-ch-ua':
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'image',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'same-origin',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        referer: parsedUrl.origin,
        host: parsedUrl.hostname,
        origin: parsedUrl.origin,
      },
      maxRedirects: 5,
      validateStatus: (status: number) => status < 400,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
        keepAlive: true,
        timeout: 10000,
      }),
      decompress: true,
      responseType: 'arraybuffer' as const,
    };
  }

  private async fetchIcon(
    url: string,
    config: any = {}
  ): Promise<IconResult | null> {
    try {
      const response = await axios.get(url, {
        ...this.getAxiosConfig(url),
        ...config,
      });

      if (response.data) {
        const iconBuffer = Buffer.from(response.data);
        const contentType = response.headers['content-type'] || 'image/x-icon';
        return {
          buffer: iconBuffer,
          contentType,
          iconUrl: url,
        };
      }
    } catch (error) {
      console.log(
        `获取图标失败 [${url}]: ${
          error instanceof Error ? error.message : '未知错误'
        }`
      );
    }
    return null;
  }

  private async tryGoogleFavicon(
    mainDomain: string
  ): Promise<IconResult | null> {
    const googleFaviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(
      mainDomain
    )}`;
    console.log(`尝试使用 Google favicon 服务: ${googleFaviconUrl}`);

    const result = await this.fetchIcon(googleFaviconUrl, { timeout: 5000 });
    if (result) {
      console.log('✓ 成功从 Google 获取图标');
      return result;
    }
    return null;
  }

  private async tryDirectFavicon(
    mainDomain: string
  ): Promise<IconResult | null> {
    const defaultIconUrl = new URL('/favicon.ico', mainDomain).href;
    console.log(`尝试直接获取 favicon.ico: ${defaultIconUrl}`);

    const result = await this.fetchIcon(defaultIconUrl);
    if (result) {
      console.log('✓ 成功获取 favicon.ico');
      return result;
    }
    return null;
  }

  private async tryPageIcons(mainDomain: string): Promise<IconResult | null> {
    try {
      const response = await axios.get(mainDomain, {
        ...this.getAxiosConfig(mainDomain),
        responseType: 'text',
      });

      const $ = cheerio.load(response.data);
      const links: IconLink[] = [];
      const baseUrl = new URL(mainDomain).origin;

      for (const selector of this.iconSelectors) {
        $(selector).each((_, el) => {
          const $el = $(el);
          const href = $el.attr('href') || $el.attr('content');
          if (href) {
            links.push({
              selector,
              href: href.startsWith('http')
                ? href
                : new URL(href, baseUrl).href,
            });
          }
        });
      }

      if (links.length > 0) {
        console.log('\n找到的图标链接:');
        for (const icon of links) {
          console.log(`尝试获取图标: ${icon.href}`);
          const result = await this.fetchIcon(icon.href);
          if (result) {
            console.log('✓ 成功获取图标');
            return result;
          }
        }
      } else {
        console.log('未在页面中找到图标链接');
      }
    } catch (error) {
      console.error(
        '解析页面失败:',
        error instanceof Error ? error.message : '未知错误'
      );
    }
    return null;
  }

  private getDefaultIcon(): IconResult {
    const defaultIconPath = path.join('website', 'default.jpg');
    const defaultIconBuffer = fs.readFileSync(defaultIconPath);
    return {
      buffer: defaultIconBuffer,
      contentType: 'image/jpeg',
      iconUrl: defaultIconPath,
    };
  }

  async getIcon(cleanedUrl: string, mainDomain: string): Promise<IconResult> {
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

      console.log(`尝试获取网站图标: ${mainDomain}`);

      // 按优先级尝试不同的获取方式
      const result =
        (await this.tryDirectFavicon(mainDomain)) ||
        (await this.tryPageIcons(mainDomain)) ||
        (await this.tryGoogleFavicon(mainDomain)) ||
        this.getDefaultIcon();

      // 如果不是默认图标，保存到缓存
      if (result.iconUrl !== path.join('website', 'default.jpg')) {
        this.saveIconToFile(cleanedUrl, result.buffer, result.contentType);
      }

      return result;
    } catch (error) {
      console.error(
        '获取图标失败:',
        error instanceof Error ? error.message : '未知错误'
      );
      return this.getDefaultIcon();
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
      const metaFileName = `${cleanedUrl.replace(
        /[^a-zA-Z0-9]/g,
        '_'
      )}.meta.json`;
      const filePath = path.join('website', fileName);
      const metaFilePath = path.join('website', metaFileName);

      // 确保文件夹存在
      fs.mkdirSync('website', { recursive: true });

      // 写入图标文件
      fs.writeFileSync(filePath, buffer);

      // 写入元数据文件
      const metaData = {
        timestamp: Date.now(),
        contentType,
      };
      fs.writeFileSync(metaFilePath, JSON.stringify(metaData));

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
      const metaFilePrefix = `${cleanedUrl.replace(
        /[^a-zA-Z0-9]/g,
        '_'
      )}.meta.`;
      const filePath = path.join('website');
      const files = fs.readdirSync(filePath);

      const cachedFile = files.find(
        (file) => file.startsWith(fileNamePrefix) && !file.includes('.meta.')
      );
      const metaFile = files.find((file) => file.startsWith(metaFilePrefix));

      if (cachedFile && metaFile) {
        const metaFilePath = path.join(filePath, metaFile);
        const metaContent = JSON.parse(fs.readFileSync(metaFilePath, 'utf-8'));
        const now = Date.now();
        const expiryTime =
          metaContent.timestamp + this.CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
        console.log('缓存过期时间:', expiryTime);
        console.log('当前时间:', now);
        if (now > expiryTime) {
          console.log('缓存已过期，删除缓存文件和元数据文件');
          // 缓存已过期，删除缓存文件和元数据文件
          fs.unlinkSync(path.join(filePath, cachedFile));
          fs.unlinkSync(metaFilePath);
          return null;
        }

        return path.join(filePath, cachedFile);
      }
      return null;
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
