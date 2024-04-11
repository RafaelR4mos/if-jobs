import { FastifyInstance } from 'fastify';
import { sql } from '../../lib/postgres';
import { ZodError, z } from 'zod';
import crypto from 'node:crypto';
import { hashPassword } from '../../utils/passwordHandler';

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
      throw new Error(error);
    }
  });

  app.get('/:id_usuario', async (request, reply) => {
    const getSingleUser = z.object({
      id_usuario: z.string().transform(Number),
    });

    const { id_usuario } = getSingleUser.parse(request.params);

    try {
      const result = await sql/*sql*/ `
      SELECT id_usuario, id_perfil, nm_usuario, cpf_usuario, dt_nascimento, login_usuario 
      FROM tb_usuario
      WHERE id_usuario = ${Number(id_usuario)}
    `;

      return { result: result[0] };
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          message: 'Error during validation',
          errors: error.flatten().fieldErrors,
        });
      }
      throw new Error(error);
    }
  });

  app.post('/', async (request, reply) => {
    try {
      const createUserSchema = z.object({
        id_perfil: z.number(),
        nm_usuario: z
          .string()
          .min(3, 'O e-mail deve ter no mínimo 3 caracteres')
          .max(60, 'O e-mail deve ter no máximo 60 caracteres')
          .trim(),
        cpf_usuario: z
          .string()
          .min(11, 'O cpf deve ter no mínimo 12 caracteres')
          .max(15, 'O e-mail deve ter no máximo 15 caracteres'),
        dt_nascimento: z.string().transform(Date),
        login_usuario: z
          .string()
          .min(3, 'O login deve ter no mínimo 3 caracteres')
          .max(50, 'O e-mail deve ter no máximo 50 caracteres'),
        senha_usuario: z.string().min(8).max(30),
      });

      const user = createUserSchema.parse(request.body);
      const hashedPassword = await hashPassword(user.senha_usuario);

      const result = await sql/*sql*/ `
        INSERT INTO 
        Tb_Usuario (id_perfil, nm_usuario, cpf_usuario, dt_nascimento, login_usuario, senha_usuario)
        VALUES (${user.id_perfil}, ${user.nm_usuario}, ${user.cpf_usuario}, ${user.dt_nascimento}, ${user.login_usuario}, ${hashedPassword}) 
      `;

      console.log(hashedPassword);
      console.log(result);

      reply.status(201);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          message: 'Error during field validation',
          errors: error.flatten().fieldErrors,
        });
      }

      throw new Error(error);
    }
  });

  app.delete('/:id_usuario', async (request, reply) => {
    try {
      const deleteUserParamsSchema = z.object({
        id_usuario: z.string().transform(Number),
      });

      const { id_usuario } = deleteUserParamsSchema.parse(request.params);

      await sql/*sql*/ `
        DELETE FROM Tb_usuario
        WHERE id_usuario = ${id_usuario}
      `;

      reply.status(204);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          message: 'Error during validation',
          errors: error.flatten().fieldErrors,
        });
      }

      throw new Error(error);
    }
  });

  app.put('/:id_usuario', async (request, reply) => {
    const editUserSchemaParams = z.object({
      id_usuario: z.string().transform(Number),
    });

    const editUserSchemaBody = z.object({
      id_perfil: z.number(),
      nm_usuario: z
        .string()
        .min(3, 'O e-mail deve ter no mínimo 3 caracteres')
        .max(60, 'O e-mail deve ter no máximo 60 caracteres')
        .trim(),
      cpf_usuario: z
        .string()
        .min(11, 'O cpf deve ter no mínimo 12 caracteres')
        .max(15, 'O e-mail deve ter no máximo 15 caracteres'),
      dt_nascimento: z.string().transform(Date),
      login_usuario: z
        .string()
        .min(3, 'O login deve ter no mínimo 3 caracteres')
        .max(50, 'O e-mail deve ter no máximo 50 caracteres'),
      senha_usuario: z.string().min(8).max(30),
    });

    try {
      const { id_usuario } = editUserSchemaParams.parse(request.params);
      const {
        cpf_usuario,
        dt_nascimento,
        id_perfil,
        login_usuario,
        nm_usuario,
        senha_usuario,
      } = editUserSchemaBody.parse(request.body);

      const hashedPassword = await hashPassword(senha_usuario);

      const result = await sql/*sql*/ `
        UPDATE tb_usuario 
        SET id_perfil = ${id_perfil}, 
        nm_usuario = ${nm_usuario}, 
        login_usuario = ${login_usuario}, 
        dt_nascimento = ${dt_nascimento},
        cpf_usuario = ${cpf_usuario}, 
        senha_usuario = ${hashedPassword}
        WHERE id_usuario = ${id_usuario}
        RETURNING id_usuario
      `;

      reply.status(200).send({ id_usuario_editado: result });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          message: 'Error during validation',
          errors: error.flatten().fieldErrors,
        });
      }

      throw new Error(error);
    }
  });
}
