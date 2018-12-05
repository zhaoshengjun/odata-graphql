const parse = require('../parser').parse;
describe('parser', () => {
	it('should parse the definition node', () => {
		const xml = '<?xml version="1.0" encoding="utf-8"?>';
		let node = parse(xml, null);
		expect(node.name).toBe('xml');
		expect(node.type).toBe('XMLDefinition');
		expect(node.attributes).toContainEqual({ name: 'version', value: '1.0' });
		expect(node.attributes).toContainEqual({ name: 'encoding', value: 'utf-8' });
	});
});
