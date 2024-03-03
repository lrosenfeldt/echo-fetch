import * as http from 'node:http';

/**
 * @param {http.IncomingHttpHeaders} headers
 * @returns {string[]}
 */
function formatHeaders(headers) {
	/**
	 * @type {string[]}
	 */
	let output = [];

	for (const name in headers) {
		let line = '';
		const header = headers[name];

		if (header === undefined) {
			line += name + ': ';
		} else if (typeof header === 'string') {
			line += name + ': ' + header;
		} else {
			line += name + ': ' + header.join(', ');
		}

		output.push(line);
	}
	return output;
}

const server = http.createServer((req, res) => {
	/**
	 * @type {string | undefined}
	 */
	let body = undefined;
	req.setEncoding('utf-8');

	const headers = formatHeaders(req.headers);
  const firstLine = (req.method ?? 'GET' ).toUpperCase() + ' ' + (req.url ?? '/') + ' HTTP/1.1\n';
	setTimeout(() => {
		if (body === undefined) {
      res.statusCode = 400;
      res.end();
			return;
		}

		const maxLineSize = headers.reduce(
			(max, line) => Math.max(max, line.length),
			-1,
		);

		process.stdout.write(firstLine);
		process.stdout.write(headers.join('\n'));
		process.stdout.write('\n');
    if (body.length > 0) {
		  process.stdout.write('-'.repeat(maxLineSize) + '\n');
		  process.stdout.write(body);
		  process.stdout.write('\n');
    }
		process.stdout.write('-'.repeat(maxLineSize) + '\n\n');
	}, 1000);

	req.toArray()
		.then(arr => (body = arr.join()))
		.catch(() => {
			res.statusCode = 400;
			res.end();
		})
		.finally(() => {
			if (!res.closed) {
				res.statusCode = 200;
				res.end();
			}
		});
});

server.on('error', reason => {
	console.error('SERVER ERROR', reason);
	process.exit(2);
});

server.listen(1337, () => {
	console.error('Server listening on http://localhost:1337/');
});
