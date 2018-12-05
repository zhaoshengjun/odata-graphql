const createXMLNode = ({ name, type, value, parent, attributes, children }) => {
	this.name = name;
	this.type = type;
	this.value = value;
	this.parent = parent;
	this.attributes = attributes;
	this.children = children;
	return this;
};

module.exports = { createXMLNode };
