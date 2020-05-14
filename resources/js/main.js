import { Priority, Status, Task, TaskManager } from './modules/todo.js';

/**
 * Main function that receives a task and creates a task element
 *
 * @param {Task} task
 */
function createTaskElement(task) {

	// Get the priority and status
	let priority = task.priority.toLowerCase();
	let status = task.status.toLowerCase();

	// Define the background color and parent container to add this element to
	// based on their priority and status

	// bg : 
	// 		stauts done: alert-secondary
	// 		priortiy high: alert-danger
	// 				 med: alert-warning
	// 				 low: alert-success
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
	// <div class="card card-body alert-danger task-box mb-3">
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
	// <div class="task-text">
	let textBox = document.createElement("div");
	textBox.className = "task-text";
	textBox.style.display = "block";

	// <div class="d-flex justify-content-between">
	let rowBox = document.createElement("div");
	rowBox.className = "d-flex justify-content-between";

	// <div class="mx-2">
	let leftColBox = document.createElement("div");
	leftColBox.className = "mx-2"

	// Create a new p element
	// <p class="card-text">
	let p = document.createElement("p");
	p.className = "card-text";

	// Add a text node
	let tnode = document.createTextNode(task.text);

	p.appendChild(tnode);
	leftColBox.appendChild(p);
	rowBox.appendChild(leftColBox);

	// <div>
	let rightColBox = document.createElement("div");
	rightColBox.className = "";
	rightColBox.style.display = "none";

	// <a href="" class="close">&times;</a>
	let delLink = document.createElement("a");
	delLink.className = "close";
	delLink.innerHTML = "&times;";

	rightColBox.appendChild(delLink);
	rowBox.appendChild(rightColBox);

	textBox.appendChild(rowBox);
	taskBox.appendChild(textBox);
	// End of textBox div

	// Create the Edit box container
	// <div class="edit-task">
	let editBox = document.createElement("div");
	editBox.className = "edit-task";
	// Turn off the display of this editBox. Gets turned on when the task is double clicked.
	editBox.style.display = "none";

	// Create an input
	// <input class="form-control form-control-sm mb-3" type="text" name="">
	let textInput = document.createElement("input");
	textInput.className = "form-control form-control-sm mb-3";
	textInput.setAttribute("type", "text");
	editBox.appendChild(textInput);

	// Add priority and status combo box
	for (let attribute of ["Priority", "Status"]) {
		// <div class="form-group my-3">
		let box = document.createElement("div");
		box.className = "form-group my-3";

		// <label class="form-label-font">Change Priority:</label>
		let label = document.createElement("label");
		label.innerHTML = "Change " + attribute;
		label.className = "form-label-font";

		// <select class="form-control form-control-sm">
		let cbox = document.createElement("select");
		cbox.className = "form-control form-control-sm";

		// <option>High</option>
		let values = attribute === "Priority" ? Priority.VALUES : Status.VALUES
		for (const i of values) {
			let option = document.createElement("option");
			option.innerHTML = i;
			cbox.appendChild(option);
		}

		box.appendChild(label);
		box.appendChild(cbox);
		editBox.appendChild(box);
	}

	// Buttons
	// <div class="btn-block pull-right"> !This doesn't seem to have any effect. Investigate
	let buttonBox = document.createElement("div");
	buttonBox.className = "btn-block pull-right";

	// <button type="button" class="btn btn-sm btn-danger">Cancel</button>
	let cancelButton = document.createElement("button");
	cancelButton.className = "btn btn-sm btn-danger";
	cancelButton.innerHTML = "Cancel";
	// <button type="button" class="btn btn-sm btn-success">Update</button>
	let updateButton = document.createElement("button");
	updateButton.className = "btn btn-sm btn-success";
	updateButton.innerHTML = "Update";

	buttonBox.appendChild(cancelButton);
	buttonBox.appendChild(updateButton);

	editBox.appendChild(buttonBox);
	taskBox.appendChild(editBox);
	// End of Edit Box

	// Add event handlers
	delLink.addEventListener("click", deleteTask);
	cancelButton.addEventListener("click", cancelEdit);
	updateButton.addEventListener("click", updateTask);
	textBox.addEventListener("mouseenter", toggleDeleteOption);
	textBox.addEventListener("mouseleave", toggleDeleteOption);
	taskBox.addEventListener("dblclick", taskDoubleClicked);

	// Make sure the task is hidden if the search field has some text matching
	// the contents
	taskBox.style.display = "block";
	const searchBarText = searchBar.value.toLowerCase();
	if (searchBarText && !task.text.toLowerCase().includes(searchBarText)) {
		taskBox.style.display = "none";
	}

	parent.appendChild(taskBox);
}

/**
 * Deletes an element from the webpage
 *
 * @param {element} DOMElement
 */
function deleteElement(element) {
	// Grab the element's parent and remove this element from its child list.
	const container = element.parentElement;
	container.removeChild(element);
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



function deleteTask(e) {
	let topParent = e.target.parentElement.parentElement.parentElement.parentElement;
	let taskUid = topParent.id.slice(5, topParent.id.length);

	TaskManager.RemoveTask(taskUid);
	deleteElement(topParent);
}

function toggleDeleteOption(e) {
	e.target.children[0].children[1].style.display = e.type === "mouseenter" ? "block" : "none";
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

// *************************************************************************************
// 
// Get the elements by Id and store them in variables.
// 
// *************************************************************************************

// Search field in the Navbar
const searchBar = document.getElementById("searchBar");

// Containers holding the tasks
const activeHighPriorityContents = document.getElementById("activeHighPriorityContents");
const activeMedPriorityContents = document.getElementById("activeMedPriorityContents");
const activeLowPriorityContents = document.getElementById("activeLowPriorityContents");

const doneHighPriorityContents = document.getElementById("doneHighPriorityContents");
const doneMedPriorityContents = document.getElementById("doneMedPriorityContents");
const doneLowPriorityContents = document.getElementById("doneLowPriorityContents");

// Simple array of all the containers
const priorityContents = [activeHighPriorityContents, doneHighPriorityContents,
						  activeMedPriorityContents, doneMedPriorityContents,
						  activeLowPriorityContents, doneLowPriorityContents];

// Add Task Model elements
const addTaskTextInput = document.getElementById("addTaskTextInput");
const addTaskPriorityOption = document.getElementById("addTaskPriorityOption");
const addTaskButton = document.getElementById("addTaskButton");


// *************************************************************************************
// 
// Register Event handlers
// 
// *************************************************************************************

// Trigger whenever an enter is pressed or input is detected in the search field
searchBar.addEventListener("input", filterTasks);
searchBar.addEventListener("keypress", filterTasks);

// Trigger this event when the add button is clicked
addTaskButton.addEventListener("click", addTask);


// *************************************************************************************
// 
// Initializer
// 
// *************************************************************************************

// Necessary to initialize all popovers to work
$(function () {
  $('[data-toggle="popover"]').popover()
})

// Populate the page with all the available tasks.
populateTasks();
