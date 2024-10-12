/* eslint-disable @typescript-eslint/consistent-type-definitions */

import type { Context, Input } from 'hono';
import type { GoogleUser } from '@hono/oauth-providers/google';

export type Bindings = {
	DATABASE_URL: string;
	DIRECT_URL: string;
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	GOOGLE_REDIRECT_URI: string;
};

export type Variables = {
	db: any;
	user: GoogleUser;
};

export type HonoConfig = {
	Bindings: Bindings;
	Variables: Variables;
};

export type HonoContext<P extends string = string, I extends Input = Input> = Context<HonoConfig, P, I>;
