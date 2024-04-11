import { sql } from './lib/postgres';

async function setup() {
  await sql/*sql*/ `
  alter table tb_usuario ALTER COLUMN senha_usuario TYPE VARCHAR(200)
  `;

  await sql.end();
  console.log('Funcionou');
}

setup();
