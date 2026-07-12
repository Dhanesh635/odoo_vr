import { Injectable } from '@nestjs/common';
import { ReportsRepository } from './reports.repository';

@Injectable()
export class ReportsService {
	constructor(private readonly reportsRepository: ReportsRepository) {}

	fuelEfficiency(query: Record<string, unknown>) {
		return this.reportsRepository.fuelEfficiency(query);
	}

	fleetUtilization(query: Record<string, unknown>) {
		return this.reportsRepository.fleetUtilization(query);
	}

	operationalCost(query: Record<string, unknown>) {
		return this.reportsRepository.operationalCost(query);
	}

	vehicleRoi(query: Record<string, unknown>) {
		return this.reportsRepository.vehicleRoi(query);
	}

	async exportCsv(query: Record<string, unknown>) {
		const report = String(query.report ?? 'operational-cost');
		const payload = await this.pickReport(report, query);
		const reportPayload = payload as { items?: unknown[] };
		return this.toCsv(reportPayload.items ?? [payload]);
	}

	async exportPdf(query: Record<string, unknown>) {
		const report = String(query.report ?? 'operational-cost');
		const payload = await this.pickReport(report, query);
		return Buffer.from(JSON.stringify(payload, null, 2), 'utf8');
	}

	private async pickReport(report: string, query: Record<string, unknown>) {
		switch (report) {
			case 'fuel-efficiency':
				return this.fuelEfficiency(query);
			case 'fleet-utilization':
				return this.fleetUtilization(query);
			case 'vehicle-roi':
				return this.vehicleRoi(query);
			default:
				return this.operationalCost(query);
		}
	}

	private toCsv(items: unknown) {
		const rows = Array.isArray(items) ? items : [items];
		if (rows.length === 0) {
			return '';
		}

		const firstRow = rows[0] as Record<string, unknown>;
		const headers = Object.keys(firstRow);
		const lines = [headers.join(',')];

		for (const row of rows) {
			const record = row as Record<string, unknown>;
			lines.push(headers.map((header) => JSON.stringify(record[header] ?? '')).join(','));
		}

		return lines.join('\n');
	}
}
