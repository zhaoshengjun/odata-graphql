const createXMLNode = ({
	name = '',
	type = '',
	value = '',
	parent = null,
	attributes = [],
	children = [],
	selfClosing = false
}) => {
	this.name = name;
	this.type = type;
	this.value = value;
	this.parent = parent;
	this.attributes = attributes;
	this.children = children;
	this.selfClosing = selfClosing;
	return this;
};

module.exports = { createXMLNode };
