const { Observable } = require('rxjs');

module.exports = function fromStream(stream, finishEventName = 'end', dataEventName = 'data') {
	stream.pause();

	return new Observable(observer => {
		function dataHandler(data) {
			observer.next(data);
		}

		function errorHandler(err) {
			observer.error(err);
		}

		function endHandler() {
			observer.complete();
		}

		stream.addListener(dataEventName, dataHandler);
		stream.addListener('error', errorHandler);
		stream.addListener(finishEventName, endHandler);

		stream.resume();

		return () => {
			stream.removeListener(dataEventName, dataHandler);
			stream.removeListener('error', errorHandler);
			stream.removeListener(finishEventName, endHandler);
		};
	});
};
