import type { Ref } from 'vue';

/**
 * Represents a structured error from an API fetch call.
 */
interface FetchError {
    data?: { message?: string };
    message?: string;
}

/**
 * Options for the API handler.
 * @template T The expected type of the successful API response.
 */
interface ApiHandlerOptions<T> {
    /** Callback function to execute on successful API call. */
    onSuccess?: (result: T) => void | Promise<void>;
    /** Callback function to execute on a failed API call. */
    onError?: (error: any) => void | Promise<void>;
    /** Message to display on success. */
    successMessage?: string;
    /** Fallback message to display on error. */
    errorMessage: string;
}

/**
 * @module useApiHandler
 * @description A generic composable for handling API calls with consistent state management.
 * It wraps around an API call to manage loading, error, and success states.
 * @template T The expected type of the API response.
 * @param {Ref<boolean>} loading A ref to control the loading state.
 * @param {Ref<string | null>} error A ref to store error messages.
 * @param {Ref<string | null>} success A ref to store success messages.
 * @returns An object containing the `handle` function.
 */
export const useApiHandler = (loading: Ref<boolean>, error: Ref<string | null>, success: Ref<string | null>) => {
    /**
     * Executes an API call and handles its lifecycle (loading, success, error).
     * @param {() => Promise<T>} apiCall The function that performs the API call.
     * @param {ApiHandlerOptions<T>} options Configuration for handling the API call lifecycle.
     * @returns {Promise<T | null>} The result of the API call, or null if an error occurred.
     */
        const handle = async <T>(apiCall: () => Promise<T>, options: ApiHandlerOptions<T>): Promise<T | null> => {
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
