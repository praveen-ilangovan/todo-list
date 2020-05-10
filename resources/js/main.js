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
 * User class
 * 
 * A class to hold the user information
 */
 class User {
 	constructor(name) {
 		this.name = name;
 	}
 }

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
 * Priority class
 * 
 * This defines the priority of a task
 */
 class Priority {
 	#name = null;
 	#value = 0;
 	#style = null;

 	constructor(name, value, style) {
 		this.#name = name;
 		this.#value = value;
 		this.#style = style;
 	}

	/*
		Name
	*/

	/**
	 * Get the name of the priority.
	 * name is of type String
	 */
	getName() {
		return this.#name;
	};

	/*
		Value
	*/

	/**
	 * Get the value of the priority.
	 * value is of type Number
	 */
	getValue() {
		return this.#value;
	};
 }

/**
 * HighPriority class
 * 
 */
 class HighPriority extends Priority {
 	constructor() {
 		const name = "High"
 		const value = 300

 		const color = "black";
 		const bgColor = "white";
 		const fontFamily = "Helvetica";
 		const fontSize = "20px";
 		const fontWeight = 660;

 		const style = new Style(color, bgColor,
 			fontFamily, fontSize, fontWeight);

 		super(name, value, style);
 	}
 }

/**
 * MedPriority class
 * 
 */
 class MedPriority extends Priority {
 	constructor() {
 		const name = "Med"
 		const value = 200

 		const color = "black";
 		const bgColor = "white";
 		const fontFamily = "Helvetica";
 		const fontSize = "15px";
 		const fontWeight = 300;

 		const style = new Style(color, bgColor,
 			fontFamily, fontSize, fontWeight);

 		super(name, value, style);
 	}
 }

 /**
 * LowPriority class
 * 
 */
 class LowPriority extends Priority {
 	constructor() {
 		const name = "Low"
 		const value = 100

 		const color = "black";
 		const bgColor = "white";
 		const fontFamily = "Helvetica";
 		const fontSize = "10px";
 		const fontWeight = 100;

 		const style = new Style(color, bgColor,
 			fontFamily, fontSize, fontWeight);

 		super(name, value, style);
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