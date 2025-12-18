import type { Ref } from 'vue';

interface FetchError {
    data?: { message?: string };
    message?: string;
}

interface ApiHandlerOptions<T> {
    onSuccess?: (result: T) => void | Promise<void>;
    onError?: (error: any) => void | Promise<void>;
    successMessage?: string;
    errorMessage: string;
}

export const useApiHandler = <T>(loading: Ref<boolean>, error: Ref<string | null>, success: Ref<string | null>) => {
    const handle = async (apiCall: () => Promise<T>, options: ApiHandlerOptions<T>) => {
        loading.value = true;
        error.value = null;
        success.value = null;

        try {
            const result = await apiCall();

            if (options.onSuccess) {
                await options.onSuccess(result);
            }

            if (options.successMessage) {
                success.value = options.successMessage;
            }

            return result;
        } catch (err: unknown) {
            const fetchError = err as FetchError;
            const message = fetchError?.data?.message || fetchError?.message || options.errorMessage;
            error.value = message;

            if (options.onError) {
                await options.onError(err);
            }
            
            // We don't re-throw the error here to prevent unhandled promise rejections 
            // in the calling component if they don't have a try-catch block.
            // The error state is already set and can be watched.
            return null;
        } finally {
            loading.value = false;
        }
    };

    return { handle };
};
