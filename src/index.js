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
			let cloneNode = Object.assign({}, node);
			if (cloneNode) {
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
			console.log('done');
			console.log('nodes:', nodes);
		}
	);
