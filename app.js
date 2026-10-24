const express = require('express');
const app = express();
app.use(express.json()); // Parse JSON bodies

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos); // Send array as JSON
});

// POST New – Create

app.post('/todos', (req, res) => {
  const { task } = req.body;

  if (typeof task !== 'string' || task.trim() === '') {
    return res.status(400).json({
      message: 'The task field is required'
    });
  }

  const newTodo = {
    id: Math.max(0, ...todos.map((todo) => todo.id)) + 1,
    task: task.trim(),
    completed: false
  };

  todos.push(newTodo);

  res.status(201).json(newTodo);
});


app.get('/todos/:id', (req, res) => {
  const id = Number(req.params.id);

  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({
      message: 'Todo not found'
    });
  }

  res.status(200).json(todo);
});



// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
});

app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter(
    (todo) => todo.completed === false
  );

  res.status(200).json(activeTodos);
});


// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send(); // Silent success
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
