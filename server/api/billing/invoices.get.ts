import { defineEventHandler } from "h3";
import type { Invoice } from "../../../shared/types";

export default defineEventHandler(async (_event) => {
	// TODO: Replace with actual billing provider integration
	const mockInvoices: Invoice[] = [
		{
			id: "inv_001",
			date: "2024-03-01",
			amount: 2999,
			currency: "USD",
			status: "paid",
			description: "Pro Plan - March 2024",
			downloadUrl: "#",
		},
	];

	return mockInvoices;
});
