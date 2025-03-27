'use client';
import {CreateProduction} from "@/app/productions/CreateProduction";
import React, {useState} from "react";
import {Plus} from "lucide-react";

export const CreateAProductionButton = ({ onCreated }: { onCreated?: () => void }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCreateProduction = async () => {
        onCreated?.();
        setIsModalOpen(false)
    };

    return (
        <>
            <button
                className="flex items-center text-xs bg-blue-400 font-bold w-full p-1  rounded-sm hover:bg-blue-500"
                onClick={() => setIsModalOpen(true)}
            >
                <Plus/>
                <p>New Production</p>
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