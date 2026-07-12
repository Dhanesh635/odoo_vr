import { apiRequest, QueryParams } from './axios';

export interface Expense {
	_id: string;
	vehicle: string;
	trip?: string;
	type: string;
	amount: number;
	date?: string;
	description?: string;
}

export interface ExpenseListResponse {
	items: Expense[];
	page: number;
	limit: number;
	total: number;
}

export function createExpense(payload: Partial<Expense>) {
	return apiRequest<Expense>('/expenses', {
		method: 'POST',
		body: payload,
	});
}

export function listExpenses(query: QueryParams = {}) {
	return apiRequest<ExpenseListResponse>('/expenses', { query });
}

