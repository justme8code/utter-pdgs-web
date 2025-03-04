'use client';
import { useState } from "react";
import { Modal } from "@/app/components/Modal";
import {CreateProduction} from "@/app/productions/CreateProduction";

interface NavbarProps {
    productions: { id: number, product: string, quantity: number, date: string }[];
    onSelectProduction: (id: number) => void;
}

export const Navbar = ({ productions,  onSelectProduction }: NavbarProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
            <button
                className="bg-blue-600 p-2  rounded-sm"
                onClick={() => setIsModalOpen(true)}
            >
                + Create New Production
            </button>

            <select
                className="bg-gray-700 px-4 py-2 rounded-sm"
                onChange={(e) => onSelectProduction(Number(e.target.value))}
            >
                <option value="">Select Production</option>
                {productions.map((production) => (
                    <option key={production.id} value={production.id}>
                        {production.product}
                    </option>
                ))}
            </select>

            {
                isModalOpen && <CreateProduction isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}   />
            }
        </div>
    );
};