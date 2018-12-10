const createXMLNode = ({
	name = '',
	type = '',
	value = '',
	parent = null,
	attributes = [],
	children = [],
	selfClosing = false,
	level = 9999
}) => ({
	name,
	type,
	value,
	parent,
	attributes,
	children,
	selfClosing,
	level
});

module.exports = { createXMLNode };
