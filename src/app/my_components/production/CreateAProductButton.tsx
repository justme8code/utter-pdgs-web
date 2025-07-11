'use client';
import React, {useState} from "react";
import {Plus} from "lucide-react";
import {CreateProductModal} from "@/app/my_components/production/CreateProductModal";

export const CreateAProductButton = ({onCreated, className}: { onCreated?: () => void, className?: string }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCreateProduct = async () => {
        onCreated?.();
        setIsModalOpen(false)
    };

    return (
        <>
            <button
                className={`flex items-center text-white text-xs bg-blue-500 font-bold  p-1 px-3  rounded-sm hover:bg-blue-600 ${className}`}
                onClick={() => setIsModalOpen(true)}
            >
                <Plus/>
                <p>Add product</p>
            </button>
            {
                isModalOpen && <CreateProductModal isOpen={isModalOpen} onClose={async () => {
                    await handleCreateProduct();
                }}/>
            }

        </>
    );
};