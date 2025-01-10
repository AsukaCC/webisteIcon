import express, { Express, Request, Response } from 'express';
import iconRouter from './routes/iconRouter';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// 图标路由
app.use('/api', iconRouter);

// 测试路由
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Express + TypeScript 服务器运行成功！' });
});

app.listen(port, () => {
  console.log(`⚡️[服务器]: 服务器在 http://localhost:${port} 运行`);
});