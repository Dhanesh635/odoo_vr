import {
	apiRequest,
	clearAuthToken,
	setAuthToken,
} from './axios';

export interface AuthUser {
	id: string;
	email: string;
	role: string;
}

export interface AuthResponse {
	user: AuthUser;
	token: string;
}

export interface AuthCredentials {
	email: string;
	password: string;
}

export interface RegisterPayload extends AuthCredentials {
	name: string;
	role: string;
	isActive?: boolean;
}

export async function register(payload: RegisterPayload) {
	const response = await apiRequest<AuthResponse>('/auth/register', {
		method: 'POST',
		body: payload,
	});

	setAuthToken(response.token);
	return response;
}

export async function login(payload: AuthCredentials) {
	const response = await apiRequest<AuthResponse>('/auth/login', {
		method: 'POST',
		body: payload,
	});

	setAuthToken(response.token);
	return response;
}

export function getCurrentUser() {
	return apiRequest<AuthUser>('/auth/me');
}

export function logout() {
	clearAuthToken();
}

