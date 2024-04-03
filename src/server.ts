import fastify from 'fastify';
import { perfilRoutes } from './routes/perfil/perfil/route';

const app = fastify();

app.register(perfilRoutes, {
  prefix: '/api/perfil',
});

app
  .listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => {
    console.log('HTTP Servidor rodou!');
  });
