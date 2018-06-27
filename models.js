const Sequelize = require('sequelize');

const sequelize = new Sequelize('todosDB', null, null, {
  dialect: 'sqlite',
  storage: './todos.sqlite'
});

const Todo = sequelize.define('todo', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  complete: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
});

Todo.sync({
  force: false
}).then(() => {
  console.log('Todo table created or it already exists');
}).catch((err) => {
  console.error('Failed to create Todo table', err);
});

module.exports = Todo;
