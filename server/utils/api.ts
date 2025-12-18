import type { H3Event } from 'h3';
import type { z, ZodSchema } from 'zod';

export const callWorkOS = async <T>(apiCall: () => Promise<T>, errorMessage: string): Promise<T> => {
    try {
        return await apiCall();
    } catch (err: unknown) {
        console.error(`WorkOS Error: ${errorMessage}`, err);
        const message = err instanceof Error ? err.message : errorMessage;
        throw new Error(message);
    }
};

export const readValidatedBody = async <T extends ZodSchema>(
    event: H3Event,
    schema: T
): Promise<z.infer<T>> => {
    const body = await readBody(event);
    const result = schema.safeParse(body);

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid request body',
            data: result.error.flatten(),
        });
    }

    return result.data;
};
