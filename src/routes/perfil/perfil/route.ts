import { FastifyInstance } from 'fastify';
import { sql } from '../../../lib/postgres';
import { z } from 'zod';

export async function perfilRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const result = await sql/*sql*/ `
      SELECT * 
      FROM TB_Perfil
      ORDER BY ID_Perfil DESC
    `;

    return { result };
  });

  app.post('/', async (request, reply) => {
    const createPerfilSchema = z.object({
      perfil_name: z.string().min(3),
    });

    const { perfil_name } = createPerfilSchema.parse(request.body);

    try {
      const result = await sql/*sql*/ `
          INSERT INTO TB_Perfil (Nm_Perfil)
          VALUES (${perfil_name}) RETURNING *;
        `;

      if (result.length === 1) {
        return reply.status(201).send(result[0]);
      } else {
        throw new Error('Algo deu errado!');
      }
    } catch (error) {
      return reply
        .status(400)
        .send({ message: 'Não foi possível criar o perfil' });
    }
  });

  app.delete('/:id', async (request, reply) => {
    const deletePerfilParams = z.object({
      id: z.string(),
    });

    const { id } = deletePerfilParams.parse(request.params);
    const numericId = parseInt(id, 10); // Convert id to a number

    try {
      const result = await sql/*sql*/ `
        DELETE FROM Tb_Perfil WHERE id_perfil = ${numericId}
        RETURNING *; 
      `;

      if (result.length === 1) {
        return reply.status(204).send();
      } else {
        return reply.status(404).send('Resource not found');
      }
    } catch (error) {
      console.error('Error executing SQL query:', error);
      return reply.status(500).send('Internal Server Error');
    }
  });

  app.put('/:id', async (request, reply) => {
    const editPerfilParams = z.object({
      id: z.string(),
    });

    const editPerfilSchema = z.object({
      nm_perfil: z.string().min(3),
    });

    const { id } = editPerfilParams.parse(request.params);
    const numericId = parseInt(id, 10);

    const { nm_perfil } = editPerfilSchema.parse(request.body);

    try {
      const result = await sql/*sql*/ `
      UPDATE TB_Perfil SET Nm_Perfil = ${nm_perfil};
    `;

      return reply.status(200).send(result);
    } catch (error) {
      return reply.status(400).send(error);
    }
  });
}
