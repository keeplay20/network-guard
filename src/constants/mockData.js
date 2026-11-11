export function getMockResponse(path, method) {
  const responses = {
    '/users': {
      status: 200,
      body: {
        users: [
          { id: 1, name: 'Alex Chen', role: 'engineer' },
          { id: 2, name: 'Sam Rivera', role: 'designer' },
        ],
      },
    },
    '/products': {
      status: 200,
      body: {
        products: [
          { id: 'p-101', name: 'Chaos Kit Pro', price: 49 },
          { id: 'p-102', name: 'Latency Lens', price: 29 },
        ],
      },
    },
    '/orders': {
      status: 200,
      body: {
        orders: [{ id: 'ord-9001', total: 78, status: 'shipped' }],
      },
    },
    '/login': {
      status: 200,
      body: {
        token: 'mock-jwt-chaos-playground',
        expiresIn: 3600,
        user: { id: 'u-1', email: 'dev@chaoslab.io' },
      },
    },
  };

  const key = path;
  if (!responses[key]) {
    return { status: 404, body: { error: 'Not found', path, method } };
  }
  return responses[key];
}
