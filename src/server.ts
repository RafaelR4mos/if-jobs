import fastify from "fastify";
import { sql } from "./lib/postgres";
import { z } from "zod";
const app = fastify();

app.get("/api/perfil", async (request, reply) => {
  const result = await sql/*sql*/ `
    SELECT * 
    FROM TB_Perfil
    ORDER BY ID_Perfil DESC
  `;

  return result;
});

app.post("/api/perfil", async (request, reply) => {
  const createPerfilSchema = z.object({
    perfil_name: z.string().min(3),
  });

  const { perfil_name } = createPerfilSchema.parse(request.body);

  try {
    const result = await sql/*sql*/ `
      INSERT INTO TB_Perfil (Nm_Perfil)
      VALUES (${perfil_name})
      RETURNING ID_Perfil
    `;
    const perfil = result[0];
    const { id_perfil } = perfil;

    return reply.status(201).send({ perfilId: id_perfil });
  } catch (error) {
    return reply.status(400).send({ message: "Não foi possível criar o id." });
  }
});

// app.put("")
// app.delete("")

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Servidor rodou!");
  });
