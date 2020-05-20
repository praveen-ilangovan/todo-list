/**
* Priority
* 
*/
class Priority {
	static HIGH = "High";
	static MED  = "Med";
	static LOW  = "Low";

	static VALUES = [Priority.HIGH, Priority.MED, Priority.LOW];
}

/**
* Status
* 
*/
class Status {
	static TODO = "Todo";
	static INPROGRESS  = "InProgress";
	static DONE  = "Done";

	static VALUES = [Status.TODO, Status.INPROGRESS, Status.DONE];
}

/**
* Task 
* 
* Task is the todo item. It has a text explaining what the
* task is and its priority and its status.
*/
class Task {
	constructor(uid, text, priority=Priority.HIGH, status=Status.TODO) {
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
* Adds and removes task to/from the localStorage
*/
class TaskManager {
	/**
	 * Adds a new task
	 *
	 * @param {String} text
	 * @param {String} priority : Optional : Defaults to High
	 *
	 * Returns Task
	 */
	static AddTask(text, priority=Priority.HIGH) {
		let uid = localStorage.getItem("COUNTER") || "0";

		let task = new Task(uid, text, priority);
		localStorage.setItem(uid, JSON.stringify(task));

		// Increment the counter
		uid++;
		localStorage.setItem("COUNTER", uid.toString());

		return task;
	}

	/**
	 * Get all tasks
	 *
	 * Returns an array of Tasks
	 */
	static GetTasks() {
		let tasks = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);

			// Accept only the keys that are numbers
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
	 *
	 * Returns a Task
	 */
	static GetTask(uid) {
		let item = JSON.parse(localStorage.getItem(uid));
		return new Task(item.uid, item.text, item.priority, item.status);
	}

	/**
	 * Update an existing task. Grab the task by its uid and update its fields.
	 *
	 * @param {Int} uid
	 * @param {String} text
	 * @param {String} priority
	 * @param {String} status
	 *
	 * Returns a Task
	 */
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

/**
 * DOM task element. A simple way to access Task's elements
 *
 */
class TaskElement {

	/**
	 *
	 * Recursively find parent until the task-box parent is found
	 *
	 */
	static FindTopElement(element) {
		let count = 0
		while (true) {
			if (element.classList.contains("task-box")) {
				return element;
			}

			element = element.parentElement;
			count++;

			// Just a safety measure
			if (count == 6) {
				console.log("Tooo deeeep");
				return
			}
		}
	}

	constructor(taskElement) {
		this.taskElement = TaskElement.FindTopElement(taskElement);
		this.taskId = this.taskElement.id.slice(5, this.taskElement.id.length);
	}

	// Getters
	get textBox() {
		return this.taskElement.children[0];
	}

	get deleteButton() {
		return this.textBox.children[0].children[1];
	}

	get textContent() {
		return this.taskElement.children[0].children[0].children[0].textContent;
	}

	set textContent(value) {
		this.taskElement.children[0].children[0].children[0].textContent = value;
	}

	get editBox() {
		return this.taskElement.children[1];
	}

	get textInputField() {
		return this.editBox.children[0];
	}

	get priorityBox() {
		return this.editBox.children[1].children[1];
	}

	get statusBox() {
		return this.editBox.children[2].children[1];
	}

	// Functions

	/**
	 * Gee the task for this task element using its id
	 */
	getTask() {
		return TaskManager.GetTask(this.taskId);
	}

	/**
	 * Turn on the edit mode.
	 *
	 * Display the editBox and turn off the textBox
	 * Update the fields with the task data.
	 */
	editModeOn() {
		// In edit mode, turn off textBox and turn on Edit box
		this.textBox.style.display = "none";
		this.editBox.style.display = "block";

		const task = this.getTask();

		// Update the form values
		this.textInputField.value = task.text;
		// Update the Priority box
		for (let i of this.priorityBox.children) {
			i.removeAttribute("selected");
			if (i.innerHTML.toLowerCase() === task.priority.toLowerCase()) {
				i.setAttribute("selected", "true");
			}
		}
		// Update the Status Box
		for (let i of this.statusBox.children) {
			i.removeAttribute("selected");
			if (i.innerHTML.toLowerCase() === task.status.toLowerCase()) {
				i.setAttribute("selected", "true");
			}
		}
	}

	/**
	 * Turn off the edit mode. 
	 */
	editModeOff() {
		this.textBox.style.display = "block";
		this.editBox.style.display = "none";
	}

	/**
	 * Turn off the visibilty of this element if the text
	 * doesnt match the contents.
	 *
	 * @param {String} text
	 */
	displayIfTextMatches(text) {
		// If no text, just turn on the visibility of the task
		if (!text) {
			this.taskElement.style.display = "block";
			return;
		}

		const display = this.textContent.toLowerCase().includes(text) ? "block" : "none";
		this.taskElement.style.display = display;
	}

}

// *************************************************************************************
// 
// Create and Delete Elements
// 
// *************************************************************************************


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
	cancelButton.addEventListener("click", editModeCancelled);
	updateButton.addEventListener("click", updateTask);
	textBox.addEventListener("mouseenter", toggleDeleteOption);
	textBox.addEventListener("mouseleave", toggleDeleteOption);
	taskBox.addEventListener("dblclick", editModeOn);

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

// *************************************************************************************
// 
// Event Callbacks
// 
// *************************************************************************************

// 
// Nav Bar events
// 

/**
 * Add a new task
 */
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
 * Filter the tasks based on the input in the Search Bar
 */
function filterTasks(e) {
	const enterPressed = e.type == "keypress" && e.key === "Enter";
	const textCleared = e.type == "input" && searchBar.value === "";

	if (enterPressed || textCleared) {
		e.preventDefault();
		const searchBarText = searchBar.value.toLowerCase();

		for (const priorityContent of priorityContents) {
			for (const taskBox of priorityContent.children) {
				let taskElement = new TaskElement(taskBox);
				taskElement.displayIfTextMatches(searchBarText);
			}
		}
	}
}

// 
// Task Events
// 

/**
 * When the mouse hovers over the task, display the delete button
 */
function toggleDeleteOption(e) {
	let taskElement = new TaskElement(e.target);
	taskElement.deleteButton.style.display = e.type === "mouseenter" ? "block" : "none";
}

/**
 * Delete the task
 */
function deleteTask(e) {
	let taskElement = new TaskElement(e.target);
	deleteElement(taskElement.taskElement);
}

/**
 * When a task is double clicked, shows the edit form
 */
function editModeOn(e) {
	let taskElement = new TaskElement(e.currentTarget);
	taskElement.editModeOn();
}

/**
 * Cancel the edit process.
 */
function editModeCancelled(e) {
	let taskElement = new TaskElement(e.target);
	taskElement.editModeOff();
}

/**
 * Update the task
 */
function updateTask(e) {
	let taskElement = new TaskElement(e.target);
	const task = taskElement.getTask();
	const oldPriority = task.priority;
	const oldStatus = task.status;

	let updatedText = taskElement.textInputField.value;
	let updatedPriority = taskElement.priorityBox.value;
	let updatedStatus = taskElement.statusBox.value;

	// Update the localStorage
	const updatedTask = TaskManager.UpdateTask(taskElement.taskId,
		updatedText, updatedPriority, updatedStatus);

	// if priority and status hasn't changed just update the text.
	if (oldPriority === updatedPriority && oldStatus === updatedStatus) {
		taskElement.textContent = updatedText;
		taskElement.editModeOff();
	} else {
		deleteElement(taskElement.taskElement);
		createTaskElement(updatedTask);
	}
}

// *************************************************************************************
// 
// Other Methods
// 
// *************************************************************************************

/**
 * Populate the webpage with all the available tasks
 */
function populateTasks() {
	for (const task of TaskManager.GetTasks()) {
		createTaskElement(task);
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
