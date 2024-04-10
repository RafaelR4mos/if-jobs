import { sql } from './lib/postgres';

async function setup() {
  await sql/*sql*/ `
  CREATE TABLE Tb_Area(
    id_area SERIAL primary key,
    nm_area varchar(30) not null
  )
  `;

  await sql.end();
  console.log('Funcionou');
}

setup();
