const { map, reduce } = require('rxjs/operators');
const readChunk = require('./file').readChunk;
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
let xmlFile = createXMLNode({
	type: 'XMLFile',
	name: file, // should use normalized file name
	value: '',
	parent: null,
	attributes: null,
	children: []
});
let nodes = [];
let level = 1;

const fs = require('fs');

const readStream = fs.createReadStream(file);
const newStream = readStream.pipe(delimiterStream);

fromStream(newStream)
	.pipe(
		map(data => decoder.write(data) + '>'),
		map(chunk => parse(chunk))
	)
	.subscribe(
		node => {
			console.log('[data]', node);
			let clone = Object.assign({}, node);
			nodes.push(clone);
			// console.log('[chunk]', decoder.write(data) + '>');
			// const chunk = decoder.write(data) + '>';
			// const node = parse(chunk);
			// // console.log('[current node]', node);
			// if (node) {
			// 	level = level + 1;
			// 	node['level'] = level;
			// 	nodes = [...nodes, node];
			// 	if (node.selfClosing) {
			// 		level = level - 1;
			// 	}
			// } else {
			// 	level = level - 1;
			// }
		},
		err => console.log(err),
		() => {
			console.log('done');
			console.log('nodes:', nodes);
		}
	);
// parse the chunk and generate AST

// let readChunkPromise = promisify(readChunk);
// readChunkPromise(file, {})
// 	.then(chunk => {
// 		console.log(chunk);
// 	})
// 	.catch(err => console.log(err));
// readChunk(
// 	file,
// 	{},
// 	{
// 		onData: chunk => {
// 			// console.log('[chunk]', chunk);
// 			// 2. parse chunk
// 			nodes = [...nodes, parse(chunk)];
// 			const node = parse(chunk);
// 			debugger;
// 			// for closing tag, no node will be returned
// 			// console.log('[current node]-[name]', changable.currentNode.name);
// 			// console.log('[current node]-[type]', changable.currentNode.type);
// 			if (node) {
// 				level = level + 1;
// 				node['level'] = level;
// 				// nodes.push(node);
// 				if (node.selfClosing) {
// 					level = level - 1;
// 				}
// 				// console.log('[node]', node);
// 				// console.log('[current node]-[attributes]', node.attributes);
// 				// create relationship
// 				// currentNode.children.push(node);
// 				// node.parent = currentNode;
// 				// only not closing tag will be pushed into the AST stack
// 				// if (node.type === 'XMLNode' && !node.selfClosing) {
// 				// 	changable.currentNode = node;
// 				// }
// 			} else {
// 				// closing tag
// 				level = level - 1;
// 			}
// 		},
// 		onFinish: () => {
// 			console.log('done!');
// 			console.log('[AST]:', nodes);
// 		}
// 	}
// );
