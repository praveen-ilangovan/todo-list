import { Task, TaskManager } from './modules/todo.js';

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
		textBox.children[0].children[0].textContent = updatedText;
		textBox.style.display = "block";
		editBox.style.display = "none";
	} else {
		deleteElement(topParent);
		createTaskElement(updatedTask);
	}

}

function deleteElement(element) {
	const container = element.parentElement;
	container.removeChild(element);
}

function deleteTask(e) {
	let topParent = e.target.parentElement.parentElement.parentElement.parentElement;
	let taskUid = topParent.id.slice(5, topParent.id.length);

	TaskManager.RemoveTask(taskUid);
	deleteElement(topParent);
}

function toggleDeleteOption(e) {
	e.target.children[0].children[1].style.display = e.type === "mouseenter" ? "block" : "none";
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
	const taskBoxId = "task-" + task.uid
	let taskBox = document.createElement("div");
	taskBox.className = "card card-body task-box mb-3";
	taskBox.id = taskBoxId
	taskBox.classList.add(bg);

	// If the task is inprogress
	if (status === "inprogress") {
		taskBox.classList.add("task-inprogress");
	}

	// Create the text box container
	let textBox = document.createElement("div");
	textBox.className = "task-text";
	textBox.style.display = "block";

	let rowBox = document.createElement("div");
	rowBox.className = "d-flex justify-content-between";

	let leftColBox = document.createElement("div");
	leftColBox.className = "mx-2"

	// Create a new p element
	let p = document.createElement("p");
	p.className = "card-text";

	// Add a text node
	let tnode = document.createTextNode(task.text);

	p.appendChild(tnode);
	leftColBox.appendChild(p);
	rowBox.appendChild(leftColBox);

	let rightColBox = document.createElement("div");
	rightColBox.className = "";
	rightColBox.style.display = "none";

	let delLink = document.createElement("a");
	delLink.className = "close";
	delLink.innerHTML = "&times;";

	rightColBox.appendChild(delLink);
	rowBox.appendChild(rightColBox);

	textBox.appendChild(rowBox);
	taskBox.appendChild(textBox);

	// Make sure the task is hidden if the search field has some text matching
	// the contents
	taskBox.style.display = "block";
	const searchBarText = searchBar.value.toLowerCase();
	if (searchBarText && !task.text.toLowerCase().includes(searchBarText)) {
		taskBox.style.display = "none";
	}

	// Create the Edit box container
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
	priorityLabel.className = "form-label-font";

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
	statusLabel.className = "form-label-font";

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
	delLink.addEventListener("click", deleteTask);
	cancelButton.addEventListener("click", cancelEdit);
	updateButton.addEventListener("click", updateTask);

	textBox.addEventListener("mouseenter", toggleDeleteOption);
	textBox.addEventListener("mouseleave", toggleDeleteOption);

	taskBox.addEventListener("dblclick", taskDoubleClicked);


	parent.appendChild(taskBox);
}

function populateTasks() {
	const tasks = TaskManager.GetTasks();

	for (const task of tasks) {
		createTaskElement(task);
	}
}

function displayTasksWithMatchingText(text) {
	for (const priorityContent of priorityContents) {
		for (const taskBox of priorityContent.children) {
			// If no text, just turn on the visibility of the task
			if (!text) {
				taskBox.style.display = "block";
				continue;
			}

			const textContent = taskBox.children[0].children[0].children[0].textContent;
			const display = textContent.toLowerCase().includes(text) ? "block" : "none";
			taskBox.style.display = display;
		}
	}
}

function filterTasks(e) {
	const enterPressed = e.type == "keypress" && e.key === "Enter";
	const textCleared = e.type == "input" && searchBar.value === "";

	if (enterPressed || textCleared) {
		e.preventDefault();
		displayTasksWithMatchingText(searchBar.value.toLowerCase());
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
const priorityContents = [activeHighPriorityContents, doneHighPriorityContents,
						  activeMedPriorityContents, doneMedPriorityContents,
						  activeLowPriorityContents, doneLowPriorityContents];

const searchBar = document.getElementById("searchBar");

// Event handlers
addTaskButton.addEventListener("click", addTask);

searchBar.addEventListener("input", filterTasks);
searchBar.addEventListener("keypress", filterTasks);

// Necessary to initialize all popovers to work
$(function () {
  $('[data-toggle="popover"]').popover()
})


// Load all tasks
populateTasks();
