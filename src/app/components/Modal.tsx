import { useEffect } from "react";
import {XIcon} from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

export const Modal = ({ isOpen, onClose, children,className }: ModalProps) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
        }
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null; // Don't render modal if not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-50 w-full z-50">
            <div className={`bg-white p-6 rounded-lg shadow-lg relative ${className}`}>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                    <XIcon/>
                </button>
                {children}
            </div>
        </div>
    );
};
