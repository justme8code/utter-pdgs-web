export const withLoadingAndErrorHandling = async <StoreState, T>(
    action: () => Promise<T>,
    set: (fn: (state: StoreState) => Partial<StoreState>) => void,
    onSuccess?: (result: T) => void,
    onError?: (message: string) => void
): Promise<{ data: T | null; status: boolean; error: string | null }> => {
    try {
        set((state) => ({...state, isLoading: true, error: null}));

        const result = await action();

        if (onSuccess) {
            onSuccess(result);
        }

        set((state) => ({...state, isLoading: false}));

        return {data: result, status: true, error: null};
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message || "An unexpected error occurred."
                : "An unknown error occurred.";

        console.error("Zustand helper caught error:", error);

        set((state) => ({...state, isLoading: false, error: message}));

        if (onError) {
            onError(message);
        }

        return {data: null, status: false, error: message};
    }
};
