// parse xml to AST
const createXMLNode = require('./xml').createXMLNode;

const normalized = name => name;

/**
 *
 * @param {string} chunk
 * @param {XMLNode} rootNode
 */
const parse = (chunk, rootNode) => {
	// REMEMBER: the chunk always ends with ">"
	let cleanChunk = chunk.replace(/^\s*|\s*$/g, '').replace(/\s{2,}/g, ' '); // clean space
	let node;
	let attributes = [];
	// definition node
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
			children: []
		});
		rootNode.children.push(node);
		// no need to push the stack
		return rootNode;
	}
	// close a node
	if (cleanChunk.startsWith('</')) {
		// no meaning for creating node for this
		//  only needs to do error-checking
		// so just return the parent node (like pop operation)
		if (rootNode.parent) {
			return rootNode.parent;
		} else {
			return null;
		}
	}
	// start a new node
	if (cleanChunk.startsWith('<')) {
		cleanChunk = cleanChunk.replace('<', '').replace('>', '');

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
			type: 'XMLNode',
			name: normalized(name),
			value: chunk,
			parent: rootNode,
			attributes,
			children: []
		});
		rootNode.children.push(node);
		return node;
	}
};

module.exports = { parse };
