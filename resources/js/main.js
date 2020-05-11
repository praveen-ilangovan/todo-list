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

 	// Static object to hold a list of all users.
 	static #USERS = {};

 	/**
 	 * Checks if already an instance exists before
 	 * creating a new one.
 	 */
 	static GetUser(name) {
 		if (name in User.#USERS === false) {
 			User.#USERS[name] = new User(name);
 		}
 		return User.#USERS[name];
 	}

  	constructor(name) {
 		this.name = name;
 	};
 }

/**
 * Style class
 * 
 * A class to hold the css elements. This class
 * takes care of the styling for an item in the UI
 */
 class Style {
 	#color;
 	#bgColor;
 	#fontFamily;
 	#fontSize;
 	#fontWeight;

 	constructor(color, bgColor, fontFamily, fontSize, fontWeight) {
 		this.#color = color;
 		this.#bgColor = bgColor;
 		this.#fontFamily = fontFamily;
 		this.#fontSize = fontSize;
 		this.#fontWeight = fontWeight;
 	}

 	get color() {
 		return this.#color;
 	}

  	get bgColor() {
 		return this.#bgColor;
 	}

  	get fontFamily() {
 		return this.#fontFamily;
 	}

 	get fontSize() {
 		return this.#fontSize;
 	}

  	get fontWeight() {
 		return this.#fontWeight;
 	}
 }


/**
 * BaseAttribute class
 * 
 * This defines an attribute of a task
 * It could be priority, status.
 */
 class BaseAttribute {
 	#name = null;
 	#value = 0;
 	#attrtype = null;
 	#style = null;

 	constructor(name, value, attrtype, style) {
 		this.#name = name;
 		this.#value = value;
 		this.#attrtype = attrtype;
 		this.#style = style;
 	}

	/*
		Name
	*/

	/**
	 * Get the name of the attribtue.
	 * name is of type String
	 */
	getName() {
		return this.#name;
	};

	/*
		Value
	*/

	/**
	 * Get the value of the attribute.
	 * value is of type Number
	 */
	getValue() {
		return this.#value;
	};

	/*
		Type
	*/

	/**
	 * Get the type of the attribute.
	 * type is of type String
	 */
	getType() {
		return this.#attrtype;
	};

	/**
	 * Get the style of the attribute.
	 * is of type String
	 */
	getStyle() {
		return this.#style;
	};
 }

/**
 * BasePriority class
 * 
 * This defines the priority of a task
 */
 class BasePriority extends BaseAttribute {
 	constructor(name, value, style) {
 		const attrtype = "priority";
 		super(name, value, attrtype, style);
 	}
 }

/**
 * HighPriority class
 * 
 */
 class HighPriority extends BasePriority {
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
 class MedPriority extends BasePriority {
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
 class LowPriority extends BasePriority {
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