const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];
  const commentToCreate = { id: commentId, content, status: 'pending' };
  comments.push(commentToCreate);
  commentsByPostId[req.params.id] = comments;

  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      ...commentToCreate,
      postId: req.params.id,
    },
  });

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  console.log(`Received Event ${req.body.type}`);

  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { id, postId, status } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((c) => c.id === id);
    comment.status = status;

    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: {
        ...comment,
        postId,
      },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});
