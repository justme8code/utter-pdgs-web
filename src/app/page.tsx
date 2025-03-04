'use client';
export default function Home() {

    return (
        <main className="flex w-full h-screen">

            <div className="flex flex-col w-full items-center justify-center p-8">
                <h1 className="text-2xl font-bold mb-4">Welcome to the Home Page</h1>

                <button
                    className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
                    onClick={() => {}}
                >
                    + Create New Production
                </button>

                {/* Placeholder for production list */}
                <div className="mt-6 w-full max-w-4xl bg-gray-100 p-6 rounded-md shadow">
                    <h2 className="text-lg font-semibold mb-2">Your Productions</h2>
                    <p className="text-gray-500">No productions yet. Start by creating one!</p>
                </div>
            </div>

            {/* Modal */}

        </main>
    );
}
