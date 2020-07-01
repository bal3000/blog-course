const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  const newPost = {
    id,
    title,
  };
  posts[id] = newPost;

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: newPost,
  });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log(`Received Event ${req.body.type}`);
  res.send({});
});

app.listen(4000, () => {
  console.log('v2');
  console.log('Listening on 4000');
});
