// parse xml to AST
const createXMLNode = require('./xml').createXMLNode;

const normalized = name => name;

/**
 *
 * @param {string} chunk
 * @param {XMLNode} rootNode
 */
const parse = (chunk, rootNode) => {
	let cleanChunk = chunk.replace(/^\s*|\s*$/g, '').replace(/\s{2,}/g, ' '); // clean space
	let node;
	let attributes = [];
	if (cleanChunk.startsWith('<?') && cleanChunk.endsWith('?>')) {
		cleanChunk = cleanChunk.replace('<?', '').replace('?>', '');
		// definition node
		let groups = cleanChunk.split(' ');
		groups.forEach(group => {
			if (group.includes('=')) {
				attributes.push({
					name: group.split('=')[0],
					value: group.split('=')[1].replace(/\"/g, '')
				});
			} else {
				name = group;
			}
		});
		node = createXMLNode({
			type: 'XMLDefinition',
			name: normalized(name),
			value: chunk,
			parent: rootNode,
			attributes,
			children: null
		});
	}
	return node;
};

module.exports = { parse };
