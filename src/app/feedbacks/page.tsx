'use client';
import React, {useState} from 'react';

export default function FeedbackPage() {
    const [feedback, setFeedback] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Submit feedbacks logic (e.g., API call)
        console.log("Feedback submitted:", feedback);
        setFeedback('');
    };

    return (
        <div className="max-w-xl my-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Feedback</h1>
            <p className="mb-4 text-gray-600">
                Please provide your feedback concerning bugs or issues with the software.
                Note: Feedback should be related to the software.
            </p>
            <form onSubmit={handleSubmit}>
                <textarea 
                    className="w-full border p-2 mb-4 rounded-md"
                    placeholder="Enter your feedback..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={5}
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Submit
                </button>
            </form>
        </div>
    );
}
