// parse xml to AST
const createXMLNode = require('./xml').createXMLNode;

const normalized = name => name;
/**
 *
 * @param {string} chunk - string to parse
 */
const parse = chunk => {
	// REMEMBER: the chunk always ends with ">"
	let cleanChunk = chunk.replace(/^\s*|\s*$/g, '').replace(/\s{2,}/g, ' '); // clean space
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

const parseXMLNodeBody = chunk => {
	// either of :
	// propertyNmae=propertyValue (value can contain space)
	// propertyName
	const regex = new RegExp(/(\S*\=\"[^\"]*\")|(\S*)/, 'g');
	let attributes = [];
	let name = '';
	let groups = chunk.match(regex).filter(data => data.length > 1);
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
	return {
		name: normalized(name),
		attributes
	};
};

const parseXMLDefinitionNode = chunk => {
	cleanChunk = chunk.replace('<?', '').replace('?>', '');
	// definition node
	const { name, attributes } = parseXMLNodeBody(cleanChunk);
	const node = createXMLNode({
		type: 'XMLDefinition',
		name,
		value: chunk,
		selfClosing: true,
		attributes,
		children: []
	});
	return node;
};

const parseXMLNormalNode = chunk => {
	let selfClosing = false;
	if (chunk.endsWith('/>')) {
		selfClosing = true;
		cleanChunk = chunk.replace('<', '').replace('/>', '');
	} else {
		cleanChunk = chunk.replace('<', '').replace('>', '');
	}
	const { name, attributes } = parseXMLNodeBody(cleanChunk);
	const node = createXMLNode({
		type: 'XMLNode',
		name,
		value: chunk,
		selfClosing,
		attributes,
		children: []
	});
	return node;
};
module.exports = { parse };
