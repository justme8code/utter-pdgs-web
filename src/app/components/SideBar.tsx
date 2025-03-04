'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex ">
            <button
                className="p-3 md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white rounded-full"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <div className={`fixed top-0 left-0  w-64 h-screen bg-gray-900 text-white p-5 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform md:translate-x-0 md:relative md:w-64`}>
                <h1 className="text-xl font-bold mb-6">Sidebar</h1>
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <Link href="/" className="block p-2 rounded hover:bg-gray-700">Home</Link>
                        </li>
                        <li>
                            <Link href="/productions" className="block p-2 rounded hover:bg-gray-700">Productions</Link>
                        </li>
                        <li>
                            <Link href="/contact" className="block p-2 rounded hover:bg-gray-700">Add new Items</Link>
                        </li>
                        <li>
                            <Link href="/contact" className="block p-2 rounded hover:bg-gray-700">Product Mix</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
