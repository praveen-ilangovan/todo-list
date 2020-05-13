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

	static UpdateTask(uid, text, priority, status) {

		let item = JSON.parse(localStorage.getItem(uid));
		if (text) {
			item.text = text;
		}
		item.priority = priority;
		item.status = status;
		localStorage.setItem(uid, JSON.stringify(item));

		return TaskManager.GetTask(uid);

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

/**
 * When a task is double clicked, shows the edit form
 */
function taskDoubleClicked(e) {
	let textBox = e.currentTarget.children[0];
	let editBox = e.currentTarget.children[1];
	let textInput = editBox.children[0];
	let priorityBox = editBox.children[1].children[1];
	let statusBox = editBox.children[2].children[1];

	textBox.style.display = "none";
	editBox.style.display = "block";

	let taskUid =  e.currentTarget.id.slice(5, e.currentTarget.id.length);
	const task = TaskManager.GetTask(taskUid)

	// Update the form values
	textInput.value = task.text;
	// 
	for (let i of priorityBox.children) {
		i.removeAttribute("selected");
		if (i.innerHTML.toLowerCase() === task.priority.toLowerCase()) {
			i.setAttribute("selected", "true");
		}
	}
	// 
	for (let i of statusBox.children) {
		i.removeAttribute("selected");
		if (i.innerHTML.toLowerCase() === task.status.toLowerCase()) {
			i.setAttribute("selected", "true");
		}
	}

	console.log(statusBox);
	console.log(task.priority);
}

/**
 * Cancel the edit process.
 */
function cancelEdit(e) {
	const topParent = e.target.parentElement.parentElement.parentElement;
	let textBox = topParent.children[0];
	let editBox = topParent.children[1];

	textBox.style.display = "block";
	editBox.style.display = "none";
}

/**
 * Update the task
 */
function updateTask(e) {
	const topParent = e.target.parentElement.parentElement.parentElement;
	let textBox = topParent.children[0];
	let editBox = topParent.children[1];
	let taskUid = topParent.id.slice(5, topParent.id.length);

	let updatedText = editBox.children[0].value;
	let updatedPriority = editBox.children[1].children[1].value;
	let updatedStatus = editBox.children[2].children[1].value;

	// before update
	const task = TaskManager.GetTask(taskUid);
	const oldPriority = task.priority;
	const oldStatus = task.status;

	// Update the localStorage
	const updatedTask = TaskManager.UpdateTask(taskUid, updatedText,
		updatedPriority, updatedStatus);

	// if priority and status hasn't changed just update the text.
	if (oldPriority === updatedPriority && oldStatus === updatedStatus) {
		textBox.children[0].textContent = updatedText;
		textBox.style.display = "block";
		editBox.style.display = "none";
	} else {
		const container = topParent.parentElement;
		container.removeChild(topParent);

		createTaskElement(updatedTask);
	}


}

function createTaskElement(task) {

	let priority = task.priority.toLowerCase();
	let status = task.status.toLowerCase();

	let bg = "alert-danger";
	let parent = activeHighPriorityContents;
	if (status === "done") {
		bg = "alert-secondary";
		parent = doneHighPriorityContents;
	}

	if (priority === "med") {
		bg = "alert-warning";
		parent = activeMedPriorityContents;

		if (status === "done") {
			bg = "alert-secondary";
			parent = doneMedPriorityContents;
		}

	} else if (priority === "low") {
		bg = "alert-success";
		parent = activeLowPriorityContents;	

		if (status === "done") {
			bg = "alert-secondary";
			parent = doneLowPriorityContents;
		}
	}

	// Create the top div container
	taskBoxId = "task-" + task.uid
	let taskBox = document.createElement("div");
	taskBox.className = "card card-body task-box mb-3";
	taskBox.id = taskBoxId
	taskBox.classList.add(bg);

	// Create the text box container
	let textBox = document.createElement("div");
	textBox.className = "task-text";

	// Create a new p element
	let p = document.createElement("p");
	p.className = "card-text";

	// Add a text node
	let tnode = document.createTextNode(task.text);

	p.appendChild(tnode);
	textBox.appendChild(p);
	taskBox.appendChild(textBox);

	// Create the text box container
	let editBox = document.createElement("div");
	editBox.className = "edit-task";

	// Create an input
	let textInput = document.createElement("input");
	textInput.className = "form-control form-control-sm mb-3";
	textInput.setAttribute("type", "text");

	editBox.appendChild(textInput);

	// Priority Box
	let priorityBox = document.createElement("div");
	priorityBox.className = "form-group my-3";

	let priorityLabel = document.createElement("label");
	priorityLabel.innerHTML = "Change Priority";

	let priorityCbox = document.createElement("select");
	priorityCbox.className = "form-control form-control-sm";

	for (let i of ["High", "Med", "Low"]) {
		let option = document.createElement("option");
		option.innerHTML = i;
		priorityCbox.appendChild(option);
	}

	priorityBox.appendChild(priorityLabel);
	priorityBox.appendChild(priorityCbox);
	editBox.appendChild(priorityBox);


	// Status Box
	let statusBox = document.createElement("div");
	statusBox.className = "form-group my-3";

	let statusLabel = document.createElement("label");
	statusLabel.innerHTML = "Change Status";

	let statusCbox = document.createElement("select");
	statusCbox.className = "form-control form-control-sm";

	for (let i of ["Todo", "InProgress", "Done"]) {
		let option = document.createElement("option");
		option.innerHTML = i;
		statusCbox.appendChild(option);
	}

	statusBox.appendChild(statusLabel);
	statusBox.appendChild(statusCbox);
	editBox.appendChild(statusBox);


	// Buttons
	let buttonBox = document.createElement("div");
	buttonBox.className = "btn-block pull-right";

	let cancelButton = document.createElement("button");
	cancelButton.className = "btn btn-sm btn-danger";
	cancelButton.innerHTML = "Cancel";
	let updateButton = document.createElement("button");
	updateButton.className = "btn btn-sm btn-success";
	updateButton.innerHTML = "Update";

	buttonBox.appendChild(cancelButton);
	buttonBox.appendChild(updateButton);

	editBox.appendChild(buttonBox);

	taskBox.appendChild(editBox);

	// Turn off the display of this editBox.
	editBox.style.display = "none";

	// Add event handlers
	cancelButton.addEventListener("click", cancelEdit);
	updateButton.addEventListener("click", updateTask);
	taskBox.addEventListener("dblclick", taskDoubleClicked);

	parent.appendChild(taskBox);
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

const activeHighPriorityContents = document.getElementById("activeHighPriorityContents");
const activeMedPriorityContents = document.getElementById("activeMedPriorityContents");
const activeLowPriorityContents = document.getElementById("activeLowPriorityContents");

const doneHighPriorityContents = document.getElementById("doneHighPriorityContents");
const doneMedPriorityContents = document.getElementById("doneMedPriorityContents");
const doneLowPriorityContents = document.getElementById("doneLowPriorityContents");

// Event handlers
addTaskButton.addEventListener("click", addTask);

// Necessary to initialize all popovers to work
$(function () {
  $('[data-toggle="popover"]').popover()
})


// Load all tasks
populateTasks();