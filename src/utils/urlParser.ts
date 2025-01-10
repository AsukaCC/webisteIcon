export function parseUrl(url: string): {
  hostname: string;
  mainDomain: string;
} {
  try {
    // 移除前后空格
    url = url.trim();

    // 移除 URL 中的查询参数和哈希
    url = url.split(/[?#]/)[0];

    // 如果 URL 不是以 http:// 或 https:// 开头，添加 https://
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // 提取顶级域名
    const parts = hostname.split('.');

    // 处理特殊情况，如 co.uk, com.cn 等
    const specialTlds = ['co.uk', 'com.cn', 'com.hk', 'co.jp', 'com.tw'];
    const fullDomain = parts.slice(-2).join('.');

    if (parts.length >= 3 && specialTlds.includes(fullDomain)) {
      // 对于特殊的二级顶级域名，取最后三部分
      return {
        hostname,
        mainDomain: parts.slice(-3).join('.')
      };
    }

    // 标准情况：取最后两部分作为主域名
    let mainDomain = parts.slice(-2).join('.');

    // 如果域名部分少于2部分，直接使用整个域名
    if (parts.length < 2) {
      mainDomain = hostname;
    }

    return {
      hostname,
      mainDomain
    };
  } catch (error) {
    // 如果 URL 解析失败，尝试作为纯域名处理
    try {
      // 移除所有协议相关字符
      const cleanUrl = url.replace(/^[^:]+:\/\//, '').split(/[/?#]/)[0];
      const parts = cleanUrl.split('.');

      if (parts.length >= 2) {
        return {
          hostname: cleanUrl,
          mainDomain: parts.slice(-2).join('.')
        };
      }

      // 如果只有一个部分，假设它是主域名
      return {
        hostname: cleanUrl,
        mainDomain: cleanUrl
      };
    } catch {
      throw new Error('无效的 URL 或域名');
    }
  }
}