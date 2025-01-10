import express, { Express, Request, Response } from 'express';
import iconRouter from './routes/iconRouter';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

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
app.use('/api/websiteIcon', iconRouter);

app.get('/', (req: Request, res: Response) => {
  res.send(`<div>${logSting}</div>`);
});

app.listen(port, () => {
  console.log(`⚡️[服务器]: 服务器在 http://localhost:${port} 运行`);
});
