import {ProductMix} from "@/app/product";

const ProductMixCard = ({ mix }: { mix: ProductMix }) => (
    <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition duration-300 w-full sm:w-[48%] lg:w-[32%]">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Product #{mix.productId}</h2>
        <p className="text-sm text-gray-600">Production ID: {mix.productionId}</p>
        <p>Total Liters Used: {mix.totalLitersUsed?.toFixed(2) || 'N/A'}</p>
        <p>Initial Brix: {mix.initialBrix?.toFixed(2) || 'N/A'}</p>
        <p>Final Brix: {mix.finalBrix?.toFixed(2) || 'N/A'}</p>
        <p>Initial PH: {mix.initialPH?.toFixed(2) || 'N/A'}</p>
        <p>Final PH: {mix.finalPH?.toFixed(2) || 'N/A'}</p>
    </div>
);
