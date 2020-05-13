/**
* Task 
* 
* Task is the todo item. It has a text explaining what the
* task is and its priority and its status.
*/
class Task {
	constructor(uid, text, priority="Low",status="todo") {
		this.uid = uid;
		this.text = text;
		this.priority = priority;
		this.status = status;
	};

	toString() {
		return `${this.text}:${this.priority}`;
	}
}

/**
* TaskManager
* 
* Adds and removes task from the localStorage
*/
class TaskManager {
	/**
	 * Adds a new task
	 *
	 * @param {String} text
	 */
	static AddTask(text, priority="Low") {
		let uid = localStorage.getItem("COUNTER") || "0";

		let task = new Task(uid, text, priority);
		localStorage.setItem(uid, JSON.stringify(task));

		uid++;
		localStorage.setItem("COUNTER", uid.toString());

		return task;
	}

	/**
	 * Get all tasks
	 *
	 * Returns an array of tasks
	 */
	static GetTasks() {
		let tasks = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (isNaN(key)) {
				continue;
			}
			tasks.push(TaskManager.GetTask(key));
		}
		return tasks;
	}

	/**
	 * Get task by its uid
	 *
	 * @param {Int} uid
	 */
	static GetTask(uid) {
		let item = JSON.parse(localStorage.getItem(uid));
		return new Task(item.uid, item.text, item.priority, item.status);
	}

	/**
	 * Remove task by its uid
	 *
	 * @param {Int} uid
	 */
	static RemoveTask(uid) {
		localStorage.removeItem(uid);
	}
}


// 
function addTask(e) {

	if (!addTaskTextInput.value) {
		const errorMsg = document.getElementById("addTaskAlert");
		errorMsg.classList.remove("d-none");

		setTimeout(function() {
			errorMsg.classList.add("d-none");
		}, 2000);

		return;
	}
	
	const task = TaskManager.AddTask(addTaskTextInput.value, addTaskPriorityOption.value);
	createTaskElement(task);
}

function createTaskElement(task) {
	let bg = "alert-danger";
	let parent = highPriorityContents;

	if (task.priority.toLowerCase() === "med") {
		bg = "alert-warning";
		parent = medPriorityContents;
	} else if (task.priority.toLowerCase() === "low") {
		bg = "alert-success";
		parent = lowPriorityContents;	
	}

	// Create a new div element
	let div = document.createElement("div");
	div.className = "card card-body task-box mb-3";
	div.classList.add(bg);

	// Create a new p element
	let p = document.createElement("p");
	p.className = "card-text";

	// Add a text node
	let tnode = document.createTextNode(task.text);

	p.appendChild(tnode);
	div.appendChild(p);
	parent.appendChild(div);
}

function populateTasks() {
	const tasks = TaskManager.GetTasks();

	for (const task of tasks) {
		createTaskElement(task);
	}
}


// Elements
const addTaskTextInput = document.getElementById("addTaskTextInput");
const addTaskPriorityOption = document.getElementById("addTaskPriorityOption");
const addTaskButton = document.getElementById("addTaskButton");

const highPriorityContents = document.getElementById("highPriorityContents");
const medPriorityContents = document.getElementById("medPriorityContents");
const lowPriorityContents = document.getElementById("lowPriorityContents");

// Event handlers
addTaskButton.addEventListener("click", addTask);

// Necessary to initialize all popovers to work
$(function () {
  $('[data-toggle="popover"]').popover()
})


// Load all tasks
populateTasks();