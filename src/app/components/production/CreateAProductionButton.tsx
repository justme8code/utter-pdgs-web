'use client';
import {CreateProduction} from "@/app/components/production/CreateProduction";
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
                className="flex items-center text-xs text-white bg-blue-500 font-bold  p-1 px-3  rounded-sm hover:bg-blue-600"
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