import {Modal} from "@/app/components/Modal";
import {useState} from "react";
import {TextField} from "@/app/components/TextField";
import {Button} from "@/app/components/Button";
import {createProduction} from "@/app/actions/production";

import {useRouter} from "next/navigation";
import {Production} from "@/app/types";

export interface ModalOnAction {
    onClose?: () => void;
    isOpen?: boolean;
}

export const CreateProduction = ({ onClose, isOpen }: ModalOnAction) => {
    const [newProduction, setNewProduction] = useState<Production>({
        name: "",
        startDate: "",
        endDate: ""
    });
    const [isError, setIsError] = useState<string|null>(null);
    const router = useRouter();


    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [dateError, setDateError] = useState<string | null>(null);

    // Validate date when updating state
    const handleDateChange = (field: "startDate" | "endDate", value: string) => {
        setNewProduction((prev) => {
            const updatedProduction = { ...prev, [field]: value };

            if (updatedProduction.startDate && updatedProduction.endDate) { 
                const start = new Date(updatedProduction.startDate);
                const end = new Date(updatedProduction.endDate);

                if (end < start) {
                    setDateError("End date cannot be earlier than start date.");
                } else {
                    setDateError(null);
                }
            }
            return updatedProduction;
        });
    };

    const handleAddProduction = async () => {
        if (dateError) return;
        setIsLoading(true);
        setSuccessMessage(null);

        try {
            const response = await createProduction(newProduction);

            if (response.error.state) {
                setIsError(response.error.message);
            } else {
                setSuccessMessage("Production added successfully!");
                setNewProduction({ name: "", startDate: "", endDate: "" });
                router.push(`/productions/${response.data.id}`)
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <Modal isOpen={isOpen ?? false} onClose={() => onClose && onClose()}>
            <div className="flex flex-col space-y-4 w-96 text-black">
                <h1 className="font-bold text-2xl mx-auto">Create A Production</h1>
                <div className="border-b border-gray-300 w-full mb-5"></div>

                <TextField
                    value={newProduction.name}
                    label="Production Name"
                    onChange={(value) => setNewProduction({ ...newProduction, name: value })}
                    props={{ placeholder: "Enter production name" }}
                />



                <TextField
                    label="Start Date"
                    value={newProduction.startDate}
                    onChange={(value) => handleDateChange("startDate", value)}
                    props={{ type: "date", placeholder: "Enter start date" }}
                />

                <TextField
                    label="End Date"
                    value={newProduction.endDate}
                    onChange={(value) => handleDateChange("endDate", value)}
                    props={{ type: "date", placeholder: "Enter end date" }}
                />

                {dateError && <p className="text-red-500 text-sm">{dateError}</p>}

                <Button
                    label={isLoading ? "Adding..." : "Add Production"}
                    onClick={handleAddProduction}
                    className="max-w-fit mx-auto"
                    disabled={isLoading || !!dateError}
                />

                <div className={"flex justify-center font-bold"}>
                    {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
                </div>

            </div>

            {isError&&<div className={"bg-gray-200 w-full rounded-sm p-3"}>
                <p className={"text-red-500"}>{isError}</p>
            </div>}
        </Modal>
    );
};
