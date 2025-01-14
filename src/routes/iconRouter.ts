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

  // 清洗 URL
  const cleanedUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '');
  const mainDomain = `https://${cleanedUrl}`;

  try {
    const result = await iconService.getIcon(cleanedUrl, mainDomain);

    // 如果没有获取到图标，返回 null
    if (!result) {
      return res.status(404).json({
        status: 404,
        message: '未找到图标',
        data: null,
      });
    }

    // 设置缓存控制
    res.setHeader('Cache-Control', 'public, max-age=86400');

    // 直接返回图标的二进制数据
    res.setHeader('Content-Type', result.contentType);
    return res.send(result.buffer); // 直接返回图标文件（浏览器直接显示图片）
  } catch (error) {
    // 处理图标获取失败的错误
    console.error('图标获取失败:', error);

    // 如果是使用默认图标的情况

    // 如果是使用默认图标的情况
    if (error instanceof Error && error.message === 'USE_DEFAULT_ICON') {


      return res.json({
        status: 204,
        message: '获取失败，使用默认图标',
        data: null, // 默认图标无法获取
      });
    }

    // 其他错误情况
    return res.status(500).json({
      status: 500,
      message: '服务器错误',
      data: null,
    });
  }
});

export default router;
