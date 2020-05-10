/**
 * Main javascript file
 */

/*
 Classes to define:
 	Task
 	Style
 	Priority
 		High
 		Med
 		Low
 	Status
 		Todo
 		InProgress
 		Done
 	Metadata
 	User

 	TaskMaanager
*/

/**
 * Style class
 * 
 * A class to hold the css elements. This class
 * takes care of the styling for an item in the UI
 */
 class Style {
 	constructor(color, bgColor, fontFamily, fontSize, fontWeight) {
 		this.color = color;
 		this.bgColor = bgColor;
 		this.fontFamily = fontFamily;
 		this.fontSize = fontSize;
 		this.fontWeight = fontWeight;
 	}
 }

/**
 * Task class
 * 
 * Task is the todo item. It has a text explaining what the
 * task is and its priority and its status.
 */
class Task {
	// unique id to this task. a private variable
	#uid = 0;
	// Task text
	#text = "";
	// Priority
	#priority = null;
	// Status
	#status = null;
	// Metadata
	#metadata = null;

	constructor(uid, text, priority) {
		this.#uid = uid;
		this.#text = text;
		
		this.setPriority(priority);
	};


	get uid() {
		return this.#uid;
	}


	/*
		Text
	*/

	/**
	 * Get the text of the task.
	 * text is of type String
	 */
	getText() {
		return this.#text;
	};

	/**
	 * Set the text of the task.
	 * 
	 * @param {String} text
	 */
	setText(text) {
		this.#text = text;
	};

	/*
		PRIORITY
	*/

	/**
	 * Get the priority of the task.
	 * prioirty is of type Priority
	 */
	getPriority() {
		return this.#priority;
	};

	/**
	 * Set the priority of the task.
	 * 
	 * @param {String} priority - "high | med | low"
	 */
	setPriority(priority) {
		this.#priority = priority;
	};

	/*
		STATUS
	*/

	/**
	 * Get the status of the task.
	 * status is of type Status
	 */
	getStatus() {
		return this.#status;
	};

	/**
	 * Set the status of the task.
	 * 
	 * @param {String} status - "todo | inprogress | done"
	 */
	setStatus(status) {
		this.#status = status;
	};

	/*
		Metadata
	*/

	/**
	 * Get the metadata.
	 * is of type Metadata
	 */
	getMetadata() {
		return this.#metadata;
	};
}