'use client';
import React, {useEffect, useState} from "react";
import {TextField} from "@/app/my_components/TextField";
import {addNewMaterial, deleteMaterial, getAllRawMaterials} from "@/app/actions/inventory";
import {Trash} from "lucide-react";
import Loading from "@/app/inventory/raw-materials/loading";
import {RawMaterial} from "@/app/types";

export const RawMaterials: React.FC = () => {
    const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchMaterials = async () => {
            setLoading(true);
            try {
                const { data, status } = await getAllRawMaterials();
                if (status) {
                    setRawMaterials(data || []);
                }
            } catch (error) {
                console.error("Failed to load rawMaterials:", error);
                setError("Failed to load rawMaterials. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchMaterials();
    }, []);

    const addMaterial = () => {
        setRawMaterials([...rawMaterials, { name: "",uom:"" }]);
    };

    const updateTextField = (index: number, value: string) => {
        setRawMaterials(rawMaterials.map((m, idx) => (idx === index ? { ...m, name: value } : m)));
    };
    const updateUOM = (index: number, value: string) => {
        setRawMaterials(rawMaterials.map((m, idx) => (idx === index ? { ...m,uom:value } : m)));
    };

    const saveMaterials = async () => {

        setLoading(true);
        try {
            const { data, status } = await addNewMaterial(rawMaterials);
            if (status && data) {
                setRawMaterials(data);
                setSuccess("Saved successfully!");
                setTimeout(() => setSuccess(null), 1000);
            } else {
                setError("Oops! Could not update changes, Please try again.");
                setTimeout(() => setError(null), 1000);
            }
        } catch (error) {
            console.error(error);
            setError( "Oops! Could not update changes, Please try again.");
            setTimeout(() => setError(null), 1000);
        } finally {
            setLoading(false);
        }
    };

    const removeMaterial = async (index:number) => {
        const rawMaterial = rawMaterials[index];
        if(rawMaterial.id){
            setLoading(true);

            try {
                const { status } = await deleteMaterial(rawMaterial.id);
                if (status) {
                    setRawMaterials(rawMaterials.filter(m => m.id !== rawMaterial.id));
                    setSuccess("Material deleted successfully!");
                } else {
                    setError("Failed to delete rawMaterial. Please try again.");
                }
            } catch (error) {
                console.error(error);
                setError("Failed to delete rawMaterial. Please try again.");
            } finally {
                setLoading(false);
            }
        }else{
            setRawMaterials(rawMaterials.filter((_, i) => i !== index));
        }

    };

    return (
         <div className={"w-full"}>
             {loading ? <Loading/> : (
                 <div className="w-full shadow-xs p-5 hover:shadow-sm">
                     <div className="flex w-full gap-10 mb-5 justify-end">
                         <div className="flex gap-5">
                             <button
                                 onClick={addMaterial}
                                 className="bg-gray-200 ring-1 ring-gray-300 flex items-center text-sm gap-2 p-1 rounded-sm"
                             >
                                 <p>Add New Material</p>
                             </button>
                             <button
                                 onClick={saveMaterials}
                                 className="bg-green-500 text-white px-4 py-1 rounded-sm disabled:bg-gray-400"
                                 disabled={loading}
                             >
                                 {loading ? "Saving..." : "Save Material"}
                             </button>
                         </div>
                     </div>
                     {error && <p className="text-red-500 font-bold">{error}</p>}
                     {success && <p className="text-green-500 font-bold">{success}</p>}
                     <table className="w-full border-collapse border border-gray-300 relative">
                         <thead>
                         <tr className="bg-gray-200 text-left">
                             <th className="p-2 border-b border-l w-3/4 border-gray-300">Name</th>
                             <th className="p-2 border-b border-l w-3/4 border-gray-300">Unit Of Measurement</th>
                             <th className="p-2 border-b border-l text-center border-gray-300">Actions</th>
                         </tr>
                         </thead>
                         <tbody>
                         {rawMaterials.map((material, index) => (
                             <tr key={index} className="border-b border-gray-300">
                                 <td className="p-2 border border-gray-300">
                                     <TextField
                                         value={material.name}
                                         onChange={value => updateTextField(index, value)}
                                         props={{ placeholder: "Enter material name" }}
                                     />
                                 </td>
                                 <td className="p-2 border border-gray-300">
                                     <TextField
                                         value={material.uom}
                                         onChange={value => updateUOM(index,value)}
                                         props={{ placeholder: "Enter UOM" }}
                                     />
                                 </td>
                                 <td className="p-2">
                                     <div className="flex gap-2 justify-center">
                                         <button
                                             title="Delete"
                                             className="bg-gray-200 hover:text-white hover:bg-gray-500 px-2 py-1 rounded-full hover:cursor-pointer"
                                             onClick={() => removeMaterial(index)}
                                         >
                                             <Trash />
                                         </button>


                                     </div>
                                 </td>
                             </tr>
                         ))}
                         </tbody>
                     </table>
                 </div>
             )}
         </div>
    );
};