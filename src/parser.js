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
		return parseXMLDefinitionNode(cleanChunk);
	}
	// close a node
	if (cleanChunk.startsWith('</')) {
		return;
	}
	// start a new node
	if (cleanChunk.startsWith('<')) {
		return parseXMLNormalNode(cleanChunk);
	}
};

const parseXMLDefinitionNode = chunk => {
	let attributes = [];
	let name = '';
	cleanChunk = chunk.replace('<?', '').replace('?>', '');
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
	return createXMLNode({
		type: 'XMLDefinition',
		name: normalized(name),
		value: chunk,
		selfClosing: true,
		attributes,
		children: []
	});
};

const parseXMLNormalNode = chunk => {
	let attributes = [];
	let name = '';
	let selfClosing = false;
	if (chunk.endsWith('/>')) {
		selfClosing = true;
		cleanChunk = chunk.replace('<', '').replace('/>', '');
	} else {
		cleanChunk = chunk.replace('<', '').replace('>', '');
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
	return createXMLNode({
		type: 'XMLNode',
		name: normalized(name),
		value: chunk,
		selfClosing,
		attributes,
		children: []
	});
};
module.exports = { parse };
