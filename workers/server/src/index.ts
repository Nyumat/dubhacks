import { Hono } from 'hono';
import { auth } from './middlewares/auth';
import { cors } from 'hono/cors';
import { PrismaClient } from 'db';

const app = new Hono();

app.use('*', auth);
app.use(
	'*',
	cors({
		origin: ['http://localhost:3000'],
	})
);
app.get('/', async (c) => c.text('Hello world'));

// Token retrieval
app.post('/google', (c) => {
	const token = c.get('token');
	const grantedScopes = c.get('granted-scopes');
	const user = c.get('user-google');

	return c.json({
		token,
		grantedScopes,
		user,
	});
});

console.log('hello from hono');

export default app;
