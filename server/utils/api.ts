export const callWorkOS = async <T>(apiCall: () => Promise<T>, errorMessage: string): Promise<T> => {
    try {
        return await apiCall();
    } catch (err: unknown) {
        console.error(`WorkOS Error: ${errorMessage}`, err);
        const message = err instanceof Error ? err.message : errorMessage;
        throw new Error(message);
    }
};
