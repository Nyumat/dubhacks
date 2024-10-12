import { googleAuth } from '@hono/oauth-providers/google';
import type { HonoContext } from '../../config';
import type { Next } from 'hono';
import { configureAuth } from 'react-query-auth';

export async function auth(c: HonoContext, next: Next) {
	return googleAuth({
		client_id: c.env.GOOGLE_CLIENT_ID,
		client_secret: c.env.GOOGLE_CLIENT_SECRET,
		scope: ['email', 'openid', 'profile'],
	})(c, next);
}

export async function isAuthenticated(c: HonoContext) {
	const user = c.get('user-google');
	const token = c.get('token');
	const grantedScopes = c.get('granted-scopes');

	if (!user) {
		throw console.error('User is not authenticated');
	}

	return c.json({
		token,
		grantedScopes,
		user,
	});
}
