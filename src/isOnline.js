
const net = require('net');
const defaultTimeout = 3 * 1000;

const checkConnection = (host, port, timeout = defaultTimeout) => {
	return new Promise((resolve, reject) => {

		const timer = setTimeout(() => {
			reject("timeout");
			socket.end();
		}, timeout);

		const socket = net.createConnection(port, host, () => {
			clearTimeout(timer);
			resolve();
			socket.end();
		});

		socket.on('error', (err) => {
			clearTimeout(timer);
			reject(err);
		});
	});
};

const fn = async (host, port) => {
	try {
		await checkConnection(host, port);
		return true;
	}
	catch(e) {
		console.log(e);
		return false;
	}
};

module.exports = fn;
