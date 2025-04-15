import { Modal } from "@/app/components/Modal";
import {SubmitHandler, useForm} from "react-hook-form";
import {RowType} from "@/app/components/production/EditableTable";

interface FormData {
    [key: string]: unknown;
}

interface EditableTableModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    selectedRow: RowType | null;
    columns: { key: string; label: string; type?: string; options?: string[] }[];
    handleModalChange: (key: string, value: string) => void;
    saveChanges: () => void;
    disableFields?: (row: RowType) => string[];
}

export const EditableTableModal = ({
    isModalOpen,
    closeModal,
    selectedRow,
    columns,
    handleModalChange,
    saveChanges,
    disableFields,
}: EditableTableModalProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit: SubmitHandler<FormData> = (data) => {
        saveChanges();
        console.log(data);
        reset();
    };

    return (
        <Modal isOpen={isModalOpen} onClose={() => {
            closeModal();
            reset();
        }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                {selectedRow && (
                    <div className="flex flex-col max-w-3xl p-4">
                        <h2 className="text-lg font-bold mb-4">Edit Row</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {columns.map((col) => {
                                const isDisabled = disableFields
                                    ? disableFields(selectedRow).includes(col.key)
                                    : false;

                                return (
                                    <label key={col.key} className="block text-sm font-medium">
                                        <div className="flex">
                                            <p>{col.label}:</p>
                                            {isDisabled && <p>(Auto)</p>}
                                        </div>
                                        {col.type === "dropdown" ? (
                                            <select
                                                {...register(col.key, {
                                                    required: `${col.label} is required.`,
                                                })}
                                                title={isDisabled ? "Auto" : ""}
                                                className="bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                                                value={selectedRow[col.key] || ""}
                                                onChange={(e) =>
                                                    handleModalChange(col.key, e.target.value)
                                                }
                                                disabled={isDisabled}
                                            >
                                                <option value="" disabled>
                                                    Select your option
                                                </option>
                                                {col.options?.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div>
                                                <input
                                                    {...register(col.key, {
                                                        required: `${col.label} is required.`,
                                                    })}
                                                    name={col.key}
                                                    placeholder={col.label}
                                                    type={col.type || "text"}
                                                    title={isDisabled ? "Auto" : ""}
                                                    className="border-none bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full p-2 rounded mt-1"
                                                    value={selectedRow[col.key] ?? ""}
                                                    onChange={(e) =>{
                                                        handleModalChange(col.key, e.target.value)
                                                    }}
                                                    disabled={isDisabled}
                                                />
                                                {errors[col.key] && (
                                                    <div className="text-red-500 text-sm mt-1">
                                                        <p>{String(errors[col.key]?.message)}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </label>
                                );
                            })}
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                           {/* <button
                                className="bg-gray-500 text-white px-4 p-1 rounded-sm hover:bg-gray-600"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>*/}
                            <button
                                type="submit"
                                className="p-1 px-4 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </Modal>
    );
};