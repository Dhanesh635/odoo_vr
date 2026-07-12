export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export const AUTH_TOKEN_KEY = 'transitops_auth_token';

export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue>;

export interface ApiRequestOptions {
	method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	token?: string;
	body?: unknown;
	responseType?: 'json' | 'text' | 'blob';
	query?: QueryParams;
	headers?: HeadersInit;
}

export function getAuthToken() {
	if (typeof window === 'undefined') {
		return null;
	}

	return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
	if (typeof window === 'undefined') {
		return;
	}

	window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
	if (typeof window === 'undefined') {
		return;
	}

	window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function buildQueryString(query?: QueryParams) {
	if (!query) {
		return '';
	}

	const params = new URLSearchParams();

	for (const [key, value] of Object.entries(query)) {
		if (value === null || value === undefined || value === '') {
			continue;
		}

		params.set(key, String(value));
	}

	const queryString = params.toString();
	return queryString ? `?${queryString}` : '';
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}) {
	const token = options.token ?? getAuthToken();
	const url = `${API_BASE_URL}${path}${buildQueryString(options.query)}`;
	const response = await fetch(url, {
		method: options.method ?? 'GET',
		headers: {
			Accept: 'application/json',
			...(options.body ? { 'Content-Type': 'application/json' } : {}),
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers,
		},
		body: options.body ? JSON.stringify(options.body) : undefined,
		cache: 'no-store',
	});

	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}

	if (options.responseType === 'blob') {
		return (await response.blob()) as T;
	}

	if (options.responseType === 'text') {
		return (await response.text()) as T;
	}

	const contentType = response.headers.get('content-type') ?? '';

	if (contentType.includes('text/csv')) {
		return (await response.text()) as T;
	}

	if (contentType.includes('application/pdf')) {
		return (await response.blob()) as T;
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return (await response.json()) as T;
}

