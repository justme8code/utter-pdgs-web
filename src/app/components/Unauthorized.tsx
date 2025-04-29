'use client';
import { ArrowLeftIcon, UserXIcon, ShieldAlertIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const Unauthorized = () => {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="flex items-center justify-center mb-4">
                    <ShieldAlertIcon className="text-red-500 w-12 h-12 mr-2" />
                    <UserXIcon className="text-red-500 w-12 h-12" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-3">Unauthorized Access</h1>
                <p className="text-gray-600 mb-4">
                    Sorry, you do not have the necessary permissions to view this page or perform this action.
                </p>
                <p className="text-gray-600 mb-4">
                    If you believe you should have access, please contact your administrator or the person in charge.
                </p>
                <button
                    onClick={handleGoBack}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-2 inline-block" /> Go Back
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;