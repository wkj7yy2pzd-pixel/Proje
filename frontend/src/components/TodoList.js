import React, { useState, useEffect } from 'react';
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  // LocalStorage-dən verilənləri yüklə
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('LocalStorage oxu xətası:', error);
      }
    }
  }, []);

  // Hər dəyişiklikdə LocalStorage-ə qeyd et
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newTodo = {
        id: Date.now(),
        text: input,
        completed: false,
        createdAt: new Date().toLocaleString('az-AZ')
      };
      setTodos([newTodo, ...todos]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h1>✓ Todo List</h1>
        <p>Məktəbəlilər, iş, və digər vəzifələri idarə edin</p>
      </div>

      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          placeholder="Yeni vəzifə əlavə edin..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="todo-input"
        />
        <button type="submit" className="add-btn">Əlavə et</button>
      </form>

      <div className="todo-stats">
        <div className="stat">
          <span className="stat-label">Cəmi:</span>
          <span className="stat-value">{todos.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Aktiv:</span>
          <span className="stat-value active">{activeCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Tamamlandı:</span>
          <span className="stat-value completed">{completedCount}</span>
        </div>
      </div>

      <div className="todo-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Hamısı ({todos.length})
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Aktiv ({activeCount})
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Tamamlandı ({completedCount})
        </button>
      </div>

      <div className="todo-list">
        {filteredTodos.length > 0 ? (
          filteredTodos.map(todo => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <div className="todo-content">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                />
                <div className="todo-text">
                  <span className="todo-title">{todo.text}</span>
                  <span className="todo-date">{todo.createdAt}</span>
                </div>
              </div>
              <button
                className="delete-btn"
                onClick={() => deleteTodo(todo.id)}
                title="Sil"
              >
                🗑️
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>📭 Heç bir vəzifə yoxdur</p>
            <span>Yeni vəzifə əlavə edin başlamaq üçün</span>
          </div>
        )}
      </div>

      {todos.length > 0 && completedCount > 0 && (
        <button className="clear-btn" onClick={clearCompleted}>
          Tamamlanmış vəzifələri sil
        </button>
      )}
    </div>
  );
};

export default TodoList;