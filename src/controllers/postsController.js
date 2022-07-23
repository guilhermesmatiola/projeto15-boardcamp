import { db, objectId } from '../dbStrategy/mongo.js';
import joi from 'joi';

export async function getTransactions(req, res) {
  const session = res.locals.session;

  //const posts = await db.collection('posts').find({ userId: new objectId(session.userId) }).toArray();
  const posts = await db.collection('transactions').find({ userId: new objectId(session.userId) }).toArray();

  res.send(posts);
}

export async function createTransaction(req, res) {
  const post = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  const postSchema = joi.object({
    description: joi.string().required(),
    value: joi.string().required(),
    date: joi.string().required(),
    type: joi.string().required().valid(...['positive','negative'])
  });

  const { error } = postSchema.validate(post);

  if (error) {
    return res.sendStatus(422);
  }

  const session = await db.collection('sessoes').findOne({ token });

  if (!session) {
    return res.sendStatus(401);
  }

  await db.collection('transactions').insertOne({ ...post, userId: session.userId });
  res.status(201).send('Post criado com sucesso');
}
