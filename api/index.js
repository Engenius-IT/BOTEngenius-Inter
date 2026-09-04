import requestListener from '../server.js';

export default function handler(req, res) {
  return requestListener(req, res);
}
