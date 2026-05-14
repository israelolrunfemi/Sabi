import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import app from '../app';

type JsonResponse = {
  statusCode: number;
  body: unknown;
};

const request = (path: string): Promise<JsonResponse> =>
  new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close();
        reject(new Error('Unable to bind test server.'));
        return;
      }

      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: address.port,
          path,
          method: 'GET',
        },
        (res) => {
          const chunks: Buffer[] = [];

          res.on('data', (chunk: Buffer) => chunks.push(chunk));
          res.on('end', () => {
            server.close((closeError) => {
              if (closeError) {
                reject(closeError);
                return;
              }

              const text = Buffer.concat(chunks).toString('utf8');
              resolve({
                statusCode: res.statusCode ?? 0,
                body: text ? JSON.parse(text) : null,
              });
            });
          });
        }
      );

      req.on('error', (error) => {
        server.close();
        reject(error);
      });

      req.end();
    });
  });

test('GET /api/v1/health returns API status', async () => {
  const response = await request('/api/v1/health');

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, {
    success: true,
    message: 'Sabi API is running',
    environment: 'development',
    version: 'v1',
    timestamp: (response.body as { timestamp: string }).timestamp,
  });
  assert.match((response.body as { timestamp: string }).timestamp, /^\d{4}-\d{2}-\d{2}T/);
});

test('unknown routes return the standard error response', async () => {
  const response = await request('/api/v1/unknown');

  assert.equal(response.statusCode, 404);
  assert.deepEqual(response.body, {
    success: false,
    message: 'Route not found: GET /api/v1/unknown',
  });
});
