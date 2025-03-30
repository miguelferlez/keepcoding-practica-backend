import process from 'node:process';
import http from 'node:http';
import app from '../app.js';

/**
 * Get port from environment and store in Express.
 */

const port = process.env.PORT || 3000;

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', err => console.log(err));
server.on('listening', () => console.log(`Server started on http://localhost:${port}\n`));