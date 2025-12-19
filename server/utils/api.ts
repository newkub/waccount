import type { H3Event, EventHandler, EventHandlerRequest } from 'h3';
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

export function defineApiHandler<T extends EventHandlerRequest, D>(handler: EventHandler<T, D>): EventHandler<T, D> {
    return defineEventHandler<T>(async (event) => {
        try {
            return await handler(event);
        } catch (error: any) {
            // Re-throw Zod validation errors
            if (error.statusCode === 400 && error.data?.issues) {
                throw error;
            }

            // Default to 500 for other errors
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.message || 'Internal Server Error',
            });
        }
    });
}

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
