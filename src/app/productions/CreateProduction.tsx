import { Modal } from "@/app/components/Modal";
import { useState } from "react";
import {TextField} from "@/app/components/TextField";
import {Button} from "@/app/components/Button";

interface CreateProductionProps {
    onClose?: () => void,
    isOpen?: boolean,
}

export const CreateProduction = ({ onClose, isOpen }: CreateProductionProps) => {
    const [newProduction, setNewProduction] = useState({ product: "", quantity: 0, date: "", manager: "", startDate: "", endDate: "" });
    const managers = ["Manager 1", "Manager 2", "Manager 3"]; // Example list of managers

    const handleAddProduction = () => {
        // Add production logic here
    };

    return (
        <Modal isOpen={isOpen ?? false} onClose={() => onClose && onClose()}>
            <div className="flex flex-col space-y-4 w-96 text-black">

                <h1 className={"font-bold text-2xl mx-auto"}>Create A Production</h1>
                <div className={"border-b border-gray-300 w-full mb-5"}></div>
                <TextField value={newProduction.product}
                           label={"Production name"}
                           onChange={value =>  setNewProduction({ ...newProduction, product: value })}
                           props={{placeholder: "Enter production name"}}
                />

                <select
                    value={newProduction.manager}
                    onChange={(e) => setNewProduction({ ...newProduction, manager: e.target.value })}
                    className="p-2 border rounded-md"
                >
                    <option value="">Select Production Manager</option>
                    {managers.map((manager, index) => (
                        <option key={index} value={manager}>
                            {manager}
                        </option>
                    ))}
                </select>


                <TextField
                    label={"Start Date"}
                    value={newProduction.date}
                    onChange={(value) => setNewProduction({ ...newProduction, startDate:value })}
                    props={{type:"date", placeholder: "Enter date"}}
                />

                <TextField
                    label={"End Date"}
                    value={newProduction.date}
                    onChange={(value) => setNewProduction({ ...newProduction, endDate:value })}
                    props={{type:"date", placeholder: "Enter date"}}
                />

                <Button
                    label={"Add Production"}
                    onClick={handleAddProduction}
                    className={"max-w-fit mx-auto"}
                />
            </div>
        </Modal>
    );
};