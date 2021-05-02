import './App.css';

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import About from './components/About';

function App() {
	const [tasks, setTasks] = useState([]);

	const [showAddTask, setShowAddTask] = useState(false);

	useEffect(() => {
		const getTasks = async () => {
			const fetchedData = await fetchTasks();
			setTasks(fetchedData);
		};

		getTasks();
	}, []);

	const fetchTasks = async () => {
		const res = await fetch('http://localhost:5000/tasks');
		const data = await res.json();
		return data;
	};

	const fetchTask = async (id) => {
		const res = await fetch(`http://localhost:5000/tasks/${id}`);
		const data = await res.json();
		return data;
	};

	const deleteTask = async (id) => {
		await fetch(`http://localhost:5000/tasks/${id}`, {
			method: 'DELETE',
		});
		setTasks(tasks.filter((task) => task.id !== id));
	};

	const toggleReminder = async (id) => {
		const fetchData = await fetchTask(id);

		const updateTask = { ...fetchData, reminder: !fetchData.reminder };

		const res = await fetch(`http://localhost:5000/tasks/${id}`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(updateTask),
		});

		const data = await res.json();

		setTasks(tasks.map((task) => (task.id === id ? { ...task, reminder: data.reminder } : task)));
	};

	const addTask = async (task) => {
		const res = await fetch(`http://localhost:5000/tasks`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(task),
		});

		const data = await res.json();
		setTasks([...tasks, data]);
		// const id = Math.floor(Math.random() * 1000) + 1;

		// const newTask = { id, ...task };

		// setTasks([...tasks, newTask]);
	};

	return (
		<Router>
			<div className="container">
				<Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
				<Route
					path="/"
					exact
					render={(props) => (
						<>
							{showAddTask && <AddTask onAdd={addTask} />}
							{tasks.length > 0 ? (
								<Tasks onToggle={toggleReminder} onDelete={deleteTask} tasks={tasks} />
							) : (
								'No tasks'
							)}
						</>
					)}
				/>

				<Route path="/About" component={About} />
				<Footer />
			</div>
		</Router>
	);
}

export default App;
