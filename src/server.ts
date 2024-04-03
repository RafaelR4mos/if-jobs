import fastify from 'fastify';
import { perfilRoutes } from './routes/perfil/route';
import { usuarioRoutes } from './routes/usuario/route';
import { areaRoutes } from './routes/area/route';

const app = fastify();

app.register(perfilRoutes, {
  prefix: '/api/perfil',
});

app.register(usuarioRoutes, {
  prefix: '/api/usuario',
});

app.register(areaRoutes, {
  prefix: 'api/area',
});

app
  .listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => {
    console.log('HTTP Servidor rodou!');
  });
