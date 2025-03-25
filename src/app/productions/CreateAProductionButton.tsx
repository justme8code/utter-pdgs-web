'use client';
import {CreateProduction} from "@/app/productions/CreateProduction";
import React, {useState} from "react";
import {Plus} from "lucide-react";

export const CreateAProductionButton = ({ onCreated }: { onCreated?: () => void }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCreateProduction = async () => {
        // Logic for creating production...
        onCreated?.();
        setIsModalOpen(false)
    };

    return (
        <>
            <button
                className="flex items-center bg-blue-600 p-2  rounded-sm text-white"
                onClick={() => setIsModalOpen(true)}
            >
                <Plus/> <h1>New Production</h1>
            </button>
            {
                isModalOpen && <CreateProduction isOpen={isModalOpen} onClose={async () => {
                    await handleCreateProduction();
                    window.location.reload();
                }}   />
            }

        </>
    );
};