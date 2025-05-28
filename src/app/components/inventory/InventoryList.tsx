import {useState} from "react";

type Ingredient = {
    id: number;
    name: string;
};

type Inventory = {
    id: number;
    name: string;
    ingredients: Ingredient[];
};

type InventoryListProps = {
    inventory: Inventory[];
    allIngredients: string[]; // Predefined list of possible ingredients
};

export const InventoryList = ({ inventory, allIngredients }: InventoryListProps) => {
    const [newMaterial, setNewMaterial] = useState("");
    const [ingredientInput, setIngredientInput] = useState("");
    const [inv, setInv] = useState<Inventory[]>(inventory);
    const [filteredIngredients, setFilteredIngredients] = useState<string[]>([]);

    const addRawMaterial = () => {
        if (!newMaterial.trim()) return;
        const newEntry = { id: inv.length + 1, name: newMaterial, ingredients: [] };
        setInv([...inv, newEntry]);
        setNewMaterial("");
    };

    const addIngredient = (materialId: number, ingredientName: string) => {
        if (!ingredientName.trim()) return;
        const newIngredient = { id: Date.now(), name: ingredientName };
        const updatedInventory = inv.map((material) =>
            material.id === materialId
                ? { ...material, ingredients: [...material.ingredients, newIngredient] }
                : material
        );
        setInv(updatedInventory);
        setIngredientInput(""); // Reset ingredient input field
        setFilteredIngredients([]); // Reset dropdown list
    };

    const removeIngredient = (materialId: number, ingredientId: number) => {
        const updatedInventory = inv.map((material) =>
            material.id === materialId
                ? { ...material, ingredients: material.ingredients.filter(ing => ing.id !== ingredientId) }
                : material
        );
        setInv(updatedInventory);
    };

    const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setIngredientInput(value);
        // Filter ingredients based on the current input
        setFilteredIngredients(allIngredients.filter(ingredient => ingredient.toLowerCase().includes(value.toLowerCase())));
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
                <button onClick={addRawMaterial} className="bg-blue-500 text-white p-2 rounded">
                    Add Raw Material
                </button>
            </div>
            <ul className="bg-white shadow rounded-lg p-4 mb-6">
                {inv.map((material) => (
                    <li key={material.id} className="p-2 border-b">
                        <h3 className="font-semibold">{material.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {/* Render selected ingredients as chips */}
                            {material.ingredients.map((ingredient) => (
                                <div key={ingredient.id} className="flex items-center bg-gray-200 rounded-full px-2 py-1">
                                    <span>{ingredient.name}</span>
                                    <button
                                        onClick={() => removeIngredient(material.id, ingredient.id)}
                                        className="ml-2 text-gray-500"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            {/* Ingredient input */}
                            <input
                                type="text"
                                value={ingredientInput}
                                onChange={handleIngredientChange}
                                placeholder="Enter ingredient"
                                className="border p-2 rounded"
                            />
                        </div>

                        {/* Dropdown for ingredients */}
                        {ingredientInput && filteredIngredients.length > 0 && (
                            <ul className="bg-white border rounded shadow-md max-h-60 overflow-auto">
                                {filteredIngredients.map((ingredient, index) => (
                                    <li
                                        key={index}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => addIngredient(material.id, ingredient)}
                                    >
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
};
