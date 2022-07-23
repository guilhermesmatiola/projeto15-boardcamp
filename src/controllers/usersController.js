import connection from '../dbStrategy/postgres.js';
import joi from 'joi';

export async function getUsers(req, res) {
  // const users = await db.collection('users').find({}).toArray();
  const { rows: users } = await connection.query('SELECT * FROM users');
  res.send(users);
}

export async function getUserById(req, res) {
  const { id } = req.params;
  // const users = await db.collection('users').find({}).toArray();
  const { rows: user } = await connection.query('SELECT * FROM users WHERE id = $1', [
    id
  ]);
  res.send(user);
}

export async function createUser(req, res) {
  const newUser = req.body;

  const userSchema = joi.object({
    nome: joi.string().required(),
    email: joi.string().required(),
    idade: joi.number().required(),
    senha: joi.string().required()
  });

  const { error } = userSchema.validate(newUser);

  if (error) {
    return res.sendStatus(422);
  }

  // await db.collection('users').insertOne(newUser);
  await connection.query(
    `INSERT INTO users (nome, email, idade, senha) 
      VALUES ('Mariazinha', 'maria@gmail.com', 35, '123456sete')`
  );

  res.status(201).send('Usuário criado com sucesso');
}