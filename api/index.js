import http from 'http';
import server from '../server.js';

export default function handler(req, res) {
  // Pass req and res directly to Node server request listener
  return server(req, res);
}
