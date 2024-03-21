// 200 -> OK
// 201 -> Criou algo com sucesso
// 404 -> notfound (não encontrou)
// 500 -> Internal Server Error

```sql
CREATE TABLE IF NOT EXISTS TB_Usuario(
ID_Usuario SERIAL PRIMARY KEY,
ID_Perfil INTEGER NOT NULL,
Nm_Usuario VARCHAR(60) NOT NULL,
CPF_Usuario CHAR(12) NOT NULL UNIQUE,
DT_Nascimento DATE NOT NULL,
Email_Usuario VARCHAR(50) NOT NULL UNIQUE,
Senha_Usuario VARCHAR(30) NOT NULL,
FOREIGN KEY (ID_Perfil) references Tb_Perfil(ID_Perfil)
);
```

```sql
CREATE TABLE IF NOT EXISTS TB_Perfil(
      ID_Perfil SERIAL PRIMARY KEY,
      Nm_Perfil VARCHAR(20) NOT NULL UNIQUE
    );
```
