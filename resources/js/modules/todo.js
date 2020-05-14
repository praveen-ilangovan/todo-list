/**
* Todo.js 
* 
*/

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

// Export all the classes from this file, so they could be imported in the main.js
export { Task, TaskManager, Priority, Status };
