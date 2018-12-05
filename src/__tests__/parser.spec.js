const parse = require('../parser').parse;
const root = { children: [] };
describe('parser', () => {
	it('should parse the definition node', () => {
		const xml = '<?xml version="1.0" encoding="utf-8"?>';
		let node = parse(xml, root);
		expect(node.name).toBe('xml');
		expect(node.type).toBe('XMLDefinition');
		expect(node.attributes).toContainEqual({ name: 'version', value: '1.0' });
		expect(node.attributes).toContainEqual({ name: 'encoding', value: 'utf-8' });
	});

	it('should parse normal node', () => {
		const xml = `<Principal Role="FromRole_ZDIS_CIRC_CLU_To_M_ZTDL_MED_ASS">`;
		let node = parse(xml, root);
		expect(node.type).toBe('XMLNode');
		expect(node.name).toBe('Principal');
		expect(node.attributes).toContainEqual({
			name: 'Role',
			value: 'FromRole_ZDIS_CIRC_CLU_To_M_ZTDL_MED_ASS'
		});
	});
});
