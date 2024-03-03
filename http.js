import * as util from 'node:util';

const { values } = util.parseArgs({
	tokens: false,
	strict: true,
	allowPositionals: false,
	args: process.argv.slice(2),
	options: {
		url: {
			type: 'string',
			short: 'U',
		},
		body: {
			type: 'string',
			short: 'b',
		},
		method: {
			type: 'string',
			short: 'X',
		},
	},
});

const url = new URL(values.url ?? '/', 'http://localhost:1337');
const body = values.body;
const method = values.method ?? 'GET';

await fetch(url, {
	method,
	headers: {
		Connection: 'close',
	},
	body,
});
