export const ProductionInfo = () => {
    return (
        <>
            <div className={"flex sticky top-0 items-center gap-x-2 ring-1 bg-gray-50 ring-gray-200 p-2 justify-between"}>
                <div className={"flex items-center gap-x-2"}>
                    <h1 className={"text-xl"}>On Going Production : </h1>
                    <h1 className={"text-lg font-bold"}>PD-20250303-1000</h1>
                </div>
                <div className={"flex gap-5"}>

                    <div className={"flex"}>
                        <h1 className={"text-sm"}>Start date : </h1>
                        <h1 className={"text-sm font-bold"}>2025-02-05</h1>
                    </div>

                    <div className={"flex"}>
                        <h1 className={"text-sm"}>End date : </h1>
                        <h1 className={"text-sm font-bold"}>2025-02-05</h1>
                    </div>
                </div>
            </div>
        </>
    );
};