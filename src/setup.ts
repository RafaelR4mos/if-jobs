import { sql } from "./lib/postgres";

async function setup() {
  await sql/*sql*/ `
CREATE TABLE tb_teste (
    id_teste INT NOT NULL
); `;

  await sql.end();
  console.log("Funcionou");
}

setup();
