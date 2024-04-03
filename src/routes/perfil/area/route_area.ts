import { FastifyInstance } from 'fastify';
import { sql } from '../../../lib/postgres';
import { z } from 'zod';

export async function areaRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const result = await sql/*sql*/ `
      SELECT * 
      FROM tb_area
      ORDER BY id_area DESC
    `;

    return { result };
  });

  app.post('/', async (request, reply) => {
    const createAreaSchema = z.object({
      nm_area: z.string().min(3),
    });

    const { nm_area } = createAreaSchema.parse(request.body);

    try {
      const result = await sql/*sql*/ `
          INSERT INTO tb_area (nm_area)
          VALUES (${nm_area}) RETURNING *;
        `;

      if (result.length === 1) {
        return reply.status(201).send(result[0]);
      } else {
        throw new Error('Algo deu errado!');
      }
    } catch (error) {
      return reply
        .status(400)
        .send({ message: 'Não foi possível criar a área' });
    }
  });

  app.delete('/:id', async (request, reply) => {
    const deleteAreaParams = z.object({
      id: z.string(),
    });

    const { id } = deleteAreaParams.parse(request.params);
    const numericId = parseInt(id, 10); // Convert id to a number

    try {
      const result = await sql/*sql*/ `
        DELETE FROM tb_area WHERE id_area = ${numericId}
        RETURNING *; 
      `;

      if (result.length === 1) {
        return reply.status(204).send();
      } else {
        return reply.status(404).send('Recurso não encontrado');
      }
    } catch (error) {
      console.error('Erro ao executar a consulta SQL:', error);
      return reply.status(500).send('Erro interno do servidor');
    }
  });

  app.put('/:id', async (request, reply) => {
    const editAreaParams = z.object({
      id: z.string(),
    });

    const editAreaSchema = z.object({
      nm_area: z.string().min(3),
    });

    const { id } = editAreaParams.parse(request.params);
    const numericId = parseInt(id, 10);

    const { nm_area } = editAreaSchema.parse(request.body);

    try {
      const result = await sql/*sql*/ `
      UPDATE tb_area SET nm_area = ${nm_area} WHERE id_area = ${numericId};
    `;

      return reply.status(200).send(result);
    } catch (error) {
      return reply.status(400).send(error);
    }
  });
}