const fs = require('fs');
// const path = require('path');
const StringDecoder = require('string_decoder').StringDecoder;
const DelimiterStream = require('delimiter-stream');

/**
 *
 * @param {string} filename - file name to parase
 * @param {object} options - options for reading file
 * @param {string} [options.delimiter='>'] - delimiter
 * @param {string} [options.coding='utf8'] - coding
 * @param {function} callback - callback function
 */
const readChunk = (filename, { delimiter = '>', coding = 'utf8' }, { onData, onDone }) => {
	const decoder = new StringDecoder(coding);
	const delimiterStream = new DelimiterStream({
		delimiter
	});
	delimiterStream.on('data', chunk => {
		onData(decoder.write(chunk) + delimiter);
	});
	delimiterStream.on('finish', _ => {
		console.log('[stream]-finish');
		onDone();
	});

	delimiterStream.on('end', _ => {
		console.log('[stream]-end');
	});
	const inputStream = fs.createReadStream(filename);
	inputStream.pipe(delimiterStream);
};

module.exports = { readChunk };
