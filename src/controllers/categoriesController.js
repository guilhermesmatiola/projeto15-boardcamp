import connection from '../dbStrategy/postgres.js';
import joi from 'joi';

export async function getCategories(req, res) {
  const { rows: categories } = await connection.query(`
    SELECT categories.id, categories.name FROM categories
  `);

  res.send(categories);
}

export async function getPostById(req, res) {
  const { id } = req.params;

  const { rows: post } = await connection.query(
    `
      SELECT posts.titulo, posts.post, posts.id, users.nome FROM posts
      JOIN user_posts
      ON posts.id = user_posts.postid
      JOIN users
      ON users.id = user_posts.userid
      WHERE posts.id = $1
    `,
    [id]
  );

  // query sem passar pelo javascrip
  console.log(post);

  const postJoin = {
    ...post[0],
    users: post.map(value => value.nome)
  };

  delete postJoin.nome;

  res.send(postJoin);
}

export async function createCategorie(req, res) {
  const newCategorie = req.body;

  const categorieSchema = joi.object({
    name: joi.string().required()
  });

  const { error } = categorieSchema.validate(newPost);

  if (error) {
    return res.sendStatus(422);
  }

  await connection.query(
    `INSERT INTO categories (name) VALUES ('${newCategorie.name}')`
  );

  res.status(201).send('Categoria criada com sucesso');
}