import React, { useState, useEffect } from 'react';

const STATUSES = ['Initialize', 'Processing', 'Complete'];

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    task: '',
    status: STATUSES[0],
  });
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const sortedTasks = storedTasks.sort((a, b) => b.createdAt - a.createdAt);
    setTasks(sortedTasks);
  }, []);
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.title.trim() !== '' && newTask.task.trim() !== '') {
      const updatedTasks = [
        ...tasks,
        {
          ...newTask,
          id: new Date().getTime().toString(),
          createdAt: new Date(),
        },
      ];

      const sortedTasks = updatedTasks.sort((a, b) => b.createdAt - a.createdAt);
      setTasks(sortedTasks);
      setNewTask({
        title: '',
        task: '',
        status: STATUSES[0],
      });
    }
  };

  const updateTask = (taskId, updatedFields) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, ...updatedFields } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-slate-200 rounded-md shadow-lg">
      <h1 className="text-3xl font-semibold mb-4">TODO</h1>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex items-start justify-between border-b py-2">
            <div>
              <h2 className="text-lg font-semibold">{task.title}</h2>
              <hr />
              <p>{task.task}</p>
              <span className={`text-${task.status === 'Complete' ? 'green' : 'red'}-500`}>
                Status: {task.status}
              </span>
            </div>
            <div>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>

              <button
                className="text-green-500 hover:text-blue-700 ml-2"
                onClick={() => {
                  const updatedStatus =
                    task.status === 'Initialize'
                      ? 'Processing'
                      : task.status === 'Processing'
                      ? 'Complete'
                      : 'Initialize';
                  updateTask(task.id, { status: updatedStatus });
                }}
              >
                Update
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="border rounded-md px-3 py-2 w-full mb-2"
        />
        <textarea
          placeholder="Task"
          value={newTask.task}
          onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
          className="border rounded-md px-3 py-2 w-full mb-2"
        />
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          className="border rounded-md px-3 py-2 w-full mb-2"
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>
    </div>
  );
}

export default App;
