const readChunk = require('./file').readChunk;
const createXMLNode = require('./xml').createXMLNode;
const file = './test/ZCLK_DISABILITY_CIRC_CLUSTER_SRV.xml';
// 1. create root node for xml
let xmlFile = createXMLNode({
	type: 'XMLFile',
	name: file, // should use normalized file name
	value: '',
	parent: null,
	attributes: null,
	children: []
});
let currentNode = xmlFile;

// parse the chunk and generate AST
readChunk(file, {}, chunk => {
	console.log('[chunk]', chunk);
	// 2. parse chunk
	currentNode = parse(chunk, currentNode);
	// 2.1 if definition node, create definition node
	// 2.2 if root node, create root node.
	// 2.3 if others, get the current node, and parse
});
