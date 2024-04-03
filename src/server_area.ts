import fastify from 'fastify';
import { areaRoutes } from './routes/perfil/area/route_area.ts';

const app = fastify();

app.register(areaRoutes, {
  prefix: '/api/area',
});

app
  .listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => {
    console.log('HTTP Servidor rodou!');
  });