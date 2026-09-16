const { getStore } = require('@netlify/blobs');

// Change this to whatever password your team wants to use.
const EDIT_PASSWORD = 'Arcnickftc2026';

exports.handler = async (event) => {
  const store = getStore('arcnick-events');

  if (event.httpMethod === 'GET') {
    const events = (await store.get('list', { type: 'json' })) || [];
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(events),
    };
  }

  if (event.httpMethod === 'POST') {
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (e) {
      return { statusCode: 400, body: 'Invalid JSON' };
    }

    if (body.password !== EDIT_PASSWORD) {
      return { statusCode: 401, body: 'Incorrect password' };
    }

    const events = (await store.get('list', { type: 'json' })) || [];

    if (body.action === 'add' && typeof body.value === 'string' && body.value.trim()) {
      events.push(body.value.trim());
    } else if (body.action === 'remove' && typeof body.index === 'number') {
      events.splice(body.index, 1);
    } else {
      return { statusCode: 400, body: 'Invalid action' };
    }

    await store.set('list', JSON.stringify(events));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(events),
    };
  }

  return { statusCode: 405, body: 'Method not allowed' };
};
