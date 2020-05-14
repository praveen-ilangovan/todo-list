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

export { Task, TaskManager };