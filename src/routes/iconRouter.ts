import { Router } from 'express';
import { IconService } from '../services/iconService';
import { parseUrl } from '../utils/urlParser';

const router = Router();
const iconService = new IconService();

router.get('/websiteIcon', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: '请提供有效的 URL' });
    }

    const { mainDomain } = parseUrl(url);
    const { buffer, contentType } = await iconService.getIcon(url, mainDomain);

    // 设置响应头
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 缓存24小时

    // 直接返回图片数据
    res.send(buffer);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: '未知错误'
      });
    }
  }
});

export default router;