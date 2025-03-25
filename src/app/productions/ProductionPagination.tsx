// app/productions/ProductionPagination.tsx
import { fetchProductions } from "@/app/productions/actions";
import { Suspense } from "react";
import { ClientProductionPagination } from "./ClientProductionPagination";

export const ProductionPagination = async ({ page = 0, size = 100 }) => {
    const response = await fetchProductions(page, size);
    const productions = response.error.state ? [] : response.data;

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ClientProductionPagination productions={productions} />
        </Suspense>
    );
};
