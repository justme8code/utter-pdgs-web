import { fetchLevel1DataInsight } from "@/app/actions/insights";
import Level1DataInsightChart from "@/app/components/Level1DataInsightChart";

export async function Level1DataInsightSection() {
    const { data, status } = await fetchLevel1DataInsight();
    if (!status) return <p>Could not fetch data</p>;

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Production and Raw Material Insights</h2>
            <Level1DataInsightChart data={data} />
        </div>
    );
}
