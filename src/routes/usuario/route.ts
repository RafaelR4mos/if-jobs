import { FastifyInstance } from 'fastify';
import { sql } from '../../lib/postgres';
import { z } from 'zod';

export async function usuarioRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    try {
      const result = await sql/*sql*/ `
      SELECT id_usuario, id_perfil, nm_usuario, cpf_usuario, dt_nascimento, login_usuario
      FROM tb_usuario
      ORDER BY id_perfil DESC
    `;

      return { result };
    } catch (error) {
      return reply
        .status(400)
        .send({ message: 'Não foi possível encontrar usuários' });
    }
  });

  app.get('/:id', async (request, reply) => {
    const getSingleUser = z.object({
      id_usuario: z.string(),
    });

    const { id_usuario } = getSingleUser.parse(request.params);

    try {
      const result = await sql/*sql*/ `
      SELECT id_usuario, id_perfil, nm_usuario, cpf_usuario, dt_nascimento, login_usuario 
      FROM tb_usuario
      WHERE id_usuario = ${Number(id_usuario)}
    `;

      return { result };
    } catch (error) {
      return reply
        .status(400)
        .send({ message: 'Não foi possível encontrar usuários' });
    }
  });

  app.post('/', async (request, reply) => {
    const createUserSchema = {
      id_usuario: z.string(),
      id_perfil: z.string(),
      nm_usuario: z
        .string()
        .min(3, 'O e-mail deve ter no mínimo 3 caracteres')
        .max(60, 'O e-mail deve ter no máximo 60 caracteres'),
      cpf_usuario: z
        .string()
        .min(12, 'O cpf deve ter no mínimo 12 caracteres')
        .max(15, 'O e-mail deve ter no máximo 15 caracteres'),
      dt_nascimento: z.date().max(new Date()),
      login_usuario: z
        .string()
        .min(3, 'O login deve ter no mínimo 3 caracteres')
        .max(50, 'O e-mail deve ter no máximo 50 caracteres'),
      senha_usuario: z
        .string()
        .min(6)
        .max(30)
        .regex(
          new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()\\-+=])[A-Za-z\\d!@#$%^&*()\\-+=]{8,}$'
          ),
          'A senha deve conter no mínimo: 1 letra maiúscula'
        ),
    };
  });

  app.delete('/:id', async () => {});

  app.put('/:id', () => {});
}
