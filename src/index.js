const readChunk = require('./file').readChunk;
const createXMLNode = require('./xml').createXMLNode;
const parse = require('./parser').parse;

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
readChunk(
	file,
	{},
	{
		onData: chunk => {
			console.log('[chunk]', chunk);
			// 2. parse chunk
			let node = parse(chunk);
			if (node) {
				console.log('[current node]-[name]', node.name);
				console.log('[current node]-[type]', node.type);
				console.log('[current node]-[attributes]', node.attributes);
				// create relationship
				currentNode.children.push(node);
				node.parent = currentNode;

				if (node.type === 'XMLNode' && !node.selfClosing) {
					currentNode = node;
				}
			}
		},
		onFinish: () => {
			console.log('done!');
		}
	}
);
