import express, { Express, Request, Response } from 'express';
import iconRouter from './routes/iconRouter';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// 设置 CORS 头
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*'); // 允许所有域名
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // 允许的请求方法
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // 允许的请求头
  next();
});

const logSting = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣦⣶⣶⣶⣦⣤⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣦⣦⣶⣦⣦⣤⣀⢀⣶⣯⣇⣇⣇⣇⣇⣇⣇⣇⣏⣷⣶⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣏⣇⣇⣇⣇⣇⣇⣇⣏⣟⣇⣧⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣏⣿⣷⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣏⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣏⣏⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣏⣯⣏⣯⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⣀⢀⠀⠀⢀⣾⣏⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣏⣯⣧⣧⣿⣶⣶⣶⣶⣶⣶⣦⣦⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢻⣯⣿⣿⣿⣿⣷⣿⣷⣯⣿⣏⣇⣇⢇⢇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣯⣏⣿⣯⣿⣯⣿⣿⣿⣿⣯⣯⣯⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣯⣿⣿⣯⣟⣏⣇⢇⢗⢗⢇⢇⢗⣇⣇⢇⢇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⢇⢇⢇⢇⢇⢇⢇⢇⢇⣏⣯⣿⣯⣿⣯⣯⣯⣿⣿⣿⣯⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣯⣯⣏⢏⢗⢗⢇⢇⢇⢇⢇⢗⢗⢗⢇⢇⢇⢇⣇⣇⣇⣇⣇⣇⣇⢗⢗⢗⢗⣇⣇⣇⣇⢗⢇⢇⢇⢇⢇⢇⢇⣇⣗⣇⣇⣏⣯⣯⣿⣿⣯⣿⣿⣯⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢀⣤⣶⣯⣯⣿⣶⣮⣯⣏⣏⣇⣇⢗⢇⢇⢇⢇⢇⢇⢇⢇⢇⣗⣗⣇⣗⣗⣇⣇⣇⣇⣇⣇⣇⣇⣗⣗⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣏⣯⣿⣯⣿⣿⣏⡏⢀⣠⣤⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢀⣶⣯⣇⣯⣇⣇⣇⣧⣧⣏⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣯⣯⣿⣿⣯⣮⣯⣧⣧⢧⢧⢯⣶⠀⠀⠀⠀⠀⠀
⢀⣯⣧⡯⠋⠋⠁⣤⣾⣏⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣧⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣯⣯⣯⣏⣏⣯⣯⣶⣦⣄⠀⠀⠀⢀⣀⣀⣤⣤
⠈⠉⠀⠀⣠⣦⣿⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣧⣯⣯⣯⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣧⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣏⣯⣇⣿⣏⢏⣏⣏⣇⣷⣄⣯⠉⠉⠉⠁⠀
⠀⠀⠀⠙⠋⠋⠋⣿⣏⣯⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣯⣧⣯⠁⣿⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣯⣯⣯⣧⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣯⣿⣧⣧⣗⢿⣿⢯⣯⣿⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣿⣯⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣧⣯⣧⡟⠁⢀⣿⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣯⠗⢿⣇⣧⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣯⣧⣇⣇⣯⣇⢈⣿⣇⢏⣖⢫⠛⠛⠛⣿⡆⠀
⠀⠀⠀⠀⠀⠀⢸⣯⣇⣇⣏⣇⣇⣇⣇⣇⣇⣇⣇⣧⣯⣇⣧⠏⠀⠀⢀⢿⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣯⣯⣯⡗⠀⢻⣇⣇⣧⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣏⣧⣯⣯⣇⣿⣟⢏⢇⣇⣇⣀⣿⣤⣾⠋⠀⠀
⠀⠀⠀⠀⠀⠀⣿⣏⣧⣯⣇⣇⣇⣇⣇⣇⣇⣇⣯⣏⣇⣯⢓⣤⣦⠟⠓⢘⣯⣧⣇⣇⣇⣧⣇⣇⣇⣇⣇⣇⣇⡏⢫⣯⡏⠗⠗⠿⣯⣇⣧⣇⣇⣧⣇⣇⣇⣇⣇⣇⣇⣇⣇⣯⣇⣏⣯⣯⣧⣇⣇⣇⣇⣇⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣿⣇⣯⣯⣇⣇⣇⣇⣇⣇⣧⢏⣏⣧⡏⠓⠉⠀⠀⠀⠀⠀⢿⣇⣧⣇⣇⣯⣯⣇⣇⣇⣇⣇⣯⠗⠀⢿⠓⠀⠀⠀⠈⢿⣧⣇⣇⣯⣯⣧⣇⣇⣇⣇⣇⣇⣇⣯⣇⣇⣇⣇⣏⣇⣇⣇⣇⣇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢰⣏⣯⣯⣇⣇⣇⣇⣇⣇⣯⢓⣿⣧⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣇⣇⣇⣯⠒⣿⣇⣇⣇⣇⣯⠒⠀⠀⠀⢀⣀⣤⣤⣦⣯⣧⣇⣏⣗⢛⣧⣧⣇⣇⣇⣇⣇⣇⣏⠛⠛⠛⢿⣧⣇⣇⣇⣇⣗⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⣇⣯⣿⣇⣇⣇⣇⣧⠏⠀⢀⣯⢿⣷⣷⣶⣶⣤⣄⣀⢀⠀⠀⠀⠋⠋⢏⢿⠒⢈⢻⣇⣇⣇⣯⣶⣾⣿⠟⠋⠛⠉⠀⠀⠀⠉⢿⣧⣧⠀⠈⢻⣧⣧⣇⣇⣇⣇⣯⢠⢶⣄⢀⢙⣿⣇⣇⣇⣇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣿⡗⢿⣇⣇⣇⣯⣗⠀⠀⠈⠀⠀⠀⠀⠀⠉⢉⣯⣿⣿⢷⢀⠀⢀⢀⢀⢀⢀⠀⢀⠀⠀⠀⠁⠀⠉⠛⠟⢿⣷⣶⣶⣤⣀⣀⣀⠉⠻⠀⠀⠀⠈⢻⣧⣧⣇⣇⣯⠀⢀⠀⢀⢀⣿⣇⣇⣇⣏⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣿⣧⢘⣧⣯⢛⡖⢿⠀⠀⠀⠀⢀⣤⣦⣿⢟⠋⢗⠁⠀⠀⢀⠀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⠀⠀⠀⠀⠀⣇⢀⠀⠀⠉⢉⡛⠁⠀⠀⠀⠀⠀⠀⠀⠋⢿⣯⣯⠀⢀⢀⢀⣤⣿⣇⣇⣇⣇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣿⣏⣧⡙⠓⠀⠃⢪⣗⠀⠀⠈⢛⠁⡀⢀⢀⢀⣧⠀⠀⠀⠀⠀⠀⠀⢀⢀⢀⢀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⣇⢀⢀⢀⢀⢀⡗⢀⢀⠀⠀⠀⠀⠐⣶⣀⣄⣮⠓⠀⢀⢀⣦⣿⣇⣇⣇⣇⠗⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣿⣇⣏⣿⣦⣤⣄⣸⣇⠀⢀⢀⢸⡗⢀⢀⢀⢀⣯⢀⠀⠀⠀⠀⠀⣠⣇⢋⢛⢛⢗⣶⣤⣤⣤⡀⠀⠀⠀⠀⣧⢀⢀⢀⢀⢀⡗⠀⠀⠀⠀⢀⢀⠀⠀⠉⠁⠀⢀⣤⣶⣿⣏⣇⣇⣇⣇⣇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣿⣇⣯⣇⣇⣇⣏⣏⣯⣶⢀⠀⢸⡗⢀⢀⢀⢀⢯⠀⢀⠀⠀⢀⣤⣏⢁⢀⢀⢀⢀⢀⢀⢀⢐⣿⣄⠀⠀⠀⣿⢀⢀⢀⢀⢀⡗⠀⠀⠀⢀⣦⣦⣦⣦⣶⣿⣿⣿⣏⣏⣇⣯⣏⣧⣇⣇⣇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣿⣯⣯⣇⣇⣇⣇⣇⣇⣏⣿⣦⣼⢗⢀⢀⢀⢀⢪⠒⠀⠀⣮⢓⢄⢀⢀⢀⢀⢀⢀⢀⢄⢀⢀⢀⢋⢏⣦⠀⣿⢀⢀⢀⢀⢀⡗⠀⢀⣤⣾⣏⣇⣇⣇⣇⣇⣇⣇⣇⣏⣇⣯⠟⢻⣇⣇⡗⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢹⡏⢿⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣏⣿⣷⣦⣤⣜⢖⠀⠀⢫⣄⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢻⣖⢪⢒⢀⣀⣤⣦⣷⣿⣏⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣧⡏⠀⠀⣧⣇⠓⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢾⠃⠈⣿⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⣏⣯⣿⣷⣿⣧⣦⣶⣶⣄⣄⣀⣀⢀⢀⣀⣄⣦⣦⣷⣷⣯⣯⣯⣇⣇⣇⣧⣯⠟⠋⣿⣇⣇⣇⣇⣇⣇⣇⣇⣇⣇⠏⠀⠀⠀⢿⣯⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠋⠉⠉⠀⠀⠀⠀⠉⠋⠛⠛⠛⠛⠛⠛⠟⠟⠟⠛⠋⠋⠋⠉⠉⠉⠉⠁⠀⠀⠀⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠈⢻⢯⠿⠟⠛⠛⣯⣇⠛⠀⠀⠀⠀⠈⠓⠀⠀⠀⠀⠀⠀⠀
`;

// 图标路由
app.use('/api', iconRouter);

app.get('/', (req: Request, res: Response) => {
  res.send(`<div style="width: 80%;height: 100%;" >${logSting}</div>`);
});

app.listen(port, () => {
  console.log(`⚡️[服务器]: 服务器在 http://localhost:${port} 运行`);
});
