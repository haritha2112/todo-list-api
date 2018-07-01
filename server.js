const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');
const Todo = require('./models');

const app = express();
app.use(bodyParser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.get('/todos', (req, res) => {
  Todo.all().then(todos => {
    res.send(todos);
  });
});

app.get('/todos/:id', (req, res) => {
  Todo.findById(req.params.id).then(todo => {
    if (todo) {
      res.send(todo);
    } else {
      res.status(404).send({ error: `Todo with id ${req.params.id} does not exist.` })
    }
  });
});

app.post('/todos', (req, res) => {
  const schema = Joi.object().keys({
    content: Joi.string().required(),
    completed: Joi.boolean(),
  });
  const result = Joi.validate(req.body, schema);
  if (result.error) {
    res.send(result.error);
  } else {
    Todo.create(req.body).then(todo => {
      res.send(todo);
    });
  }
});

app.put('/todos/:id', (req, res) => {
  const schema = Joi.object().keys({
    content: Joi.string(),
    completed: Joi.boolean(),
  });
  const result = Joi.validate(req.body, schema);
  if (result.error) {
    res.send(result.error);
  } else {
    Todo.findById(req.params.id).then(todo => {
      if (todo) {
        todo.update(req.body).then(updatedTodo => {
          res.send(updatedTodo);
        });
      } else {
        res.status(404).send({ error: `Todo with id ${req.params.id} does not exist.` })
      }
    });
  }
});

app.delete('/todos/:id', (req, res) => {
  Todo.findById(req.params.id).then(todo => {
    if (todo) {
      todo.destroy().then(() => {
        res.send({ success: `Deleted Todo with id ${req.params.id}.` });
      })
    } else {
      res.status(404).send({ error: `Todo with id ${req.params.id} does not exist.` })
    }
  });
});

app.listen(3000, () => {
  console.log('\nTodo list API listening on port 3000!\n')
});
