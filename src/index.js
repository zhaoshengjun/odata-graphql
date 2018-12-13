const fs = require('fs');
const { map } = require('rxjs/operators');
const createXMLNode = require('./xml').createXMLNode;
const parse = require('./parser').parse;
const fromStream = require('./fromStream');
const DelimiterStream = require('delimiter-stream');
const StringDecoder = require('string_decoder').StringDecoder;
const delimiterStream = new DelimiterStream({
	delimiter: '>'
});
const decoder = new StringDecoder('utf8');
const file = './test/ZCLK_DISABILITY_CIRC_CLUSTER_SRV.xml';

// 1. create root node for xml
const createRootNode = () => {
	return createXMLNode({
		type: 'XMLFile',
		name: file, // should use normalized file name
		value: '',
		parent: null,
		attributes: null,
		children: [],
		level: 1
	});
};

let level = 1;
let nodes = [];
nodes.push(createRootNode());

const readStream = fs.createReadStream(file);
const newStream = readStream.pipe(delimiterStream);

fromStream(newStream)
	.pipe(
		map(data => decoder.write(data) + '>'),
		map(chunk => parse(chunk))
	)
	.subscribe(
		node => {
			// console.log('[data]', node);
			// debugger;
			if (node) {
				let cloneNode = Object.assign({}, node);
				// add level info
				level = level + 1;
				cloneNode['level'] = level;
				nodes.push(cloneNode);

				if (cloneNode.selfClosing) {
					level = level - 1;
				}
			} else {
				level = level - 1;
			}
		},
		err => console.log(err),
		() => {
			// generate AST
			let ast = generateAST(nodes);
			// parse AST to generate graphql schema
			let schema = generateSchema(ast);
			console.log(schema);
		}
	);

// convert flat nodes into tree shape
// the nodes should be ordered (as the same order in the source file)
const generateAST = nodes => {
	let prevNode = nodes[0]; // root
	let tree = nodes[0];
	for (let index = 1; index < nodes.length; index++) {
		const node = nodes[index];
		if (node.level > prevNode.level) {
			// child node
			prevNode.children.push(node);
			node.parent = prevNode;
		} else if (node.level < prevNode.level) {
			// parent's sibling node
			prevNode.parent.parent.children.push(node);
			node.parent = prevNode.parent.parent;
		} else {
			// sibling node
			prevNode.parent.children.push(node);
			node.parent = prevNode.parent;
		}
		prevNode = node;
	}
	return tree;
};

// generate graphql Schema
const generateSchema = ast => {
	let schema = '';

	return schema;
};
