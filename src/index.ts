import express, {
  type Application,
  type Request,
  type Response,
} from 'express';

const app: Application = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('¡Hola Mundo con la configuración moderna!');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
