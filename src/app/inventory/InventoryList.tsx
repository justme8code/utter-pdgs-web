import {useState} from "react";

type Inventory = {
    id: number;
    name: string;
}
type InventoryList = {
    inventory: Inventory[];
};
export const InventoryList = ({inventory}:InventoryList) => {
    const [newMaterial, setNewMaterial] = useState("");
    const [inv,setInv]= useState<Inventory[]>(inventory);

    const addRawMaterial = () => {
        if (!newMaterial.trim()) return;
        const newEntry = { id: inv.length + 1, name: newMaterial };
        setInv([...inv, newEntry]);
        setNewMaterial("");
    };

    return (
        <section>
            <h1 className="text-2xl font-bold mb-4">Inventory</h1>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    placeholder="Enter raw material name"
                    className="border p-2 rounded"
                />
                <button onClick={addRawMaterial} className="bg-blue-500 text-white p-2 rounded">Add Raw Material</button>
            </div>
            <ul className="bg-white shadow rounded-lg p-4 mb-6">
                {inv.map((material) => (
                    <li key={material.id} className="p-2 border-b">{material.name}</li>
                ))}
            </ul>
        </section>
    );
};