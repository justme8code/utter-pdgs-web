'use client';
import React, { useState, Fragment } from "react";
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from "@headlessui/react";

export const BalanceSidebar = ({children}:{children?:React.ReactNode}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Button to open sidebar */}
            <button className={"rounded px-2  text-gray-700 py-1  bg-gray-200 hover:bg-gray-300 "} onClick={() => setIsOpen(true)}>
                Balance
            </button>

            {/* Wrap the Dialog with Transition */}
            <Transition show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40 focus:outline-none" onClose={() => setIsOpen(false)}>
                    {/* Backdrop / Overlay - using TransitionChild */}
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        {/* We use a div directly for the overlay */}
                        <div
                            className="fixed inset-0 bg-black/30"
                            aria-hidden="true"
                            onClick={() => setIsOpen(false)} // Click backdrop to close
                        />
                    </TransitionChild>

                    {/* This div contains the sidebar panel and is responsible for its fixed positioning */}
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-center justify-end"> {/* Position content to the right */}
                            {/* The actual sidebar panel - using TransitionChild */}
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="transform translate-x-full" // Start off-screen right
                                enterTo="transform translate-x-0"     // Slide to original position
                                leave="ease-in duration-200"
                                leaveFrom="transform translate-x-0"   // Start at original position
                                leaveTo="transform translate-x-full"  // Slide off-screen right
                            >
                                {/* DialogPanel is still useful for accessibility and semantic grouping */}
                                <DialogPanel className="w-96 max-w-full h-screen bg-white shadow-xl p-4 flex flex-col overflow-scroll">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="self-end mb-4 text-gray-500 hover:text-gray-800"
                                        aria-label="Close sidebar"
                                    >
                                        ✕
                                    </button>

                                    <DialogTitle className="text-lg font-bold mb-4">
                                        Balance
                                    </DialogTitle>

                                    {/* Sidebar content */}
                                    <div className="flex-grow">
                                        {/* Replace this with actual balances or menu */}
                                        {children}
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};
