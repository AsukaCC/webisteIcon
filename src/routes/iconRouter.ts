import { Router } from 'express';
import { IconService } from '../services/iconService';

const router = Router();
const iconService = new IconService();

router.get('/favicon', async (req, res) => {
  const { url } = req.query;

  // 参数验证
  if (!url || typeof url !== 'string') {
    return res.status(400).json({
      status: 400,
      message: 'URL 参数必填',
      data: null,
    });
  }
  const cleanedUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '');
  const mainDomain = `https://${cleanedUrl}`;

  try {
    const result = await iconService.getIcon(mainDomain);

    // 设置缓存控制
    res.setHeader('Cache-Control', 'public, max-age=86400');

    // 如果是直接通过浏览器访问，返回图片
    const isDirectAccess = req.headers.accept?.includes('image/*');
    if (isDirectAccess) {
      res.setHeader('Content-Type', result.contentType);
      return res.send(result.buffer);
    }

    // API 调用返回 JSON
    return res.json({
      status: 200,
      message: '获取成功',
      data: result.iconUrl, // 返回找到的图标 URL
    });
  } catch (error) {
    // 如果是使用默认图标的情况
    if (error instanceof Error && error.message === 'USE_DEFAULT_ICON') {
      // 构造默认图标URL
      const defaultIconUrl = new URL('/favicon.ico', mainDomain).href;
      return res.json({
        status: 204,
        message: '获取失败',
        data: defaultIconUrl, // 返回默认图标 URL
      });
    }

    // 其他错误情况
    console.error('Icon retrieval failed:', error);
    return res.status(500).json({
      status: 500,
      message: '服务器错误',
      data: null,
    });
  }
});

export default router;
