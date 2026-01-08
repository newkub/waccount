import { z } from "zod";

export const VerificationSchema = z.object({
	id: z.string(),
	type: z.enum(["email", "phone", "identity", "business"]),
	status: z.enum(["pending", "verified", "failed"]),
	data: z.record(z.string(), z.any()).optional().nullable(),
	verifiedAt: z.string().datetime().nullable().optional(),
});

export const KycVerificationSchema = z.object({
	id: z.string(),
	status: z.enum(["pending", "under_review", "approved", "rejected"]),
	documentType: z.enum(["passport", "id_card", "driving_license"]),
	documentNumber: z.string(),
	documentFrontUrl: z.string().url(),
	documentBackUrl: z.string().url().optional(),
	selfieUrl: z.string().url(),
	submittedAt: z.string().datetime(),
	verifiedAt: z.string().datetime().nullable().optional(),
	rejectionReason: z.string().nullable().optional(),
});

export const BusinessVerificationSchema = z.object({
	id: z.string(),
	status: z.enum(["pending", "under_review", "verified", "rejected"]),
	companyName: z.string(),
	registrationNumber: z.string(),
	taxId: z.string(),
	registrationDocumentUrl: z.string().url(),
	businessType: z.enum(["sole_proprietorship", "partnership", "corporation", "llc", "non_profit"]),
	industry: z.string(),
	address: z.string(),
	submittedAt: z.string().datetime(),
	verifiedAt: z.string().datetime().nullable().optional(),
	rejectionReason: z.string().nullable().optional(),
});
