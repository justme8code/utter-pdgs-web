import {ProductionPagination} from "@/app/my_components/production/ProductionPagination";

export default async function ProductionPage({searchParams}: {
    searchParams: Promise<{ page?: string; size?: string }>
}) {
    const page = parseInt((await searchParams).page || "0", 10);
    const size = parseInt((await searchParams).size || "100", 10);

    return (
        <>
            <div className="space-y-10">
                <ProductionPagination page={page} size={size}/>
            </div>
        </>
    );
}
