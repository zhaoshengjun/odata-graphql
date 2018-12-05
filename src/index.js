const readChunk = require('./file').readChunk;
const xmlFile =  './test/ZCLK_DISABILITY_CIRC_CLUSTER_SRV.xml';

readChunk(xmlFile,{}, chunk => {
	console.log('[chunk]', chunk);
});
