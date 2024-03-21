import { sql } from "./lib/postgres";

async function setup() {
  await sql/*sql*/ `
  ALTER TABLE TB_Usuario add column Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  `;

  await sql.end();
  console.log("Funcionou");
}

setup();
