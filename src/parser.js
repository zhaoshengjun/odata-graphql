// parse xml to AST
const createXMLNode = require('./xml').createXMLNode;

const normalized = name => name;

const regex = new RegExp(/(\S*\=\"[^\"]*\")|(\S*)/, 'g');

/**
 *
 * @param {string} chunk - string to parse
 */
const parse = chunk => {
	// REMEMBER: the chunk always ends with ">"
	let cleanChunk = chunk.replace(/^\s*|\s*$/g, '').replace(/\s{2,}/g, ' '); // clean space
	let node;
	let attributes = [];
	// definition node
	if (cleanChunk.startsWith('<?') && cleanChunk.endsWith('?>')) {
		cleanChunk = cleanChunk.replace('<?', '').replace('?>', '');
		// definition node
		let groups = cleanChunk.match(regex).filter(data => data.length > 1);
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
			selfClosing: true,
			attributes,
			children: []
		});
		return node;
	}
	// close a node
	if (cleanChunk.startsWith('</')) {
		return;
	}
	// start a new node
	if (cleanChunk.startsWith('<')) {
		let selfClosing = false;
		if (cleanChunk.endsWith('/>')) {
			selfClosing = true;
			cleanChunk = cleanChunk.replace('<', '').replace('/>', '');
		} else {
			cleanChunk = cleanChunk.replace('<', '').replace('>', '');
		}

		let groups = cleanChunk.match(regex).filter(data => data.length > 1);
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
			selfClosing,
			attributes,
			children: []
		});
		return node;
	}
};

module.exports = { parse };
