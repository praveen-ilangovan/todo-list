/**
* Task 
* 
* Task is the todo item. It has a text explaining what the
* task is and its priority and its status.
*/
class Task {
	constructor(uid, text, priority="low",status="todo") {
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
	static AddTask(text, priority="low") {
		let uid = localStorage.getItem("COUNTER") || "0";

		let task = new Task(uid, text);
		localStorage.setItem(uid, JSON.stringify(task));

		uid++;
		localStorage.setItem("COUNTER", uid.toString());
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
			if (key == "COUNTER") {
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
function addItem(e) {

	if (!addTaskTextInput.value) {
		const errorMsg = document.getElementById("addTaskAlert");
		errorMsg.classList.remove("d-none");

		setTimeout(function() {
			errorMsg.classList.add("d-none");
		}, 2000);

		return;
	}
	console.log(addTaskPriorityOption.value);

	TaskManager.AddTask(addTaskTextInput.value, addTaskPriorityOption.value);
}


// Elements
const addTaskTextInput = document.getElementById("addTaskTextInput");
const addTaskPriorityOption = document.getElementById("addTaskPriorityOption");
const addTaskButton = document.getElementById("addTaskButton");

// Event handlers
addTaskButton.addEventListener("click", addItem);