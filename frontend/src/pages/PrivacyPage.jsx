import React from 'react';

const PrivacyPage = () => {
    return (
        <div className="min-h-screen pt-20 px-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose dark:prose-invert space-y-4">
                <p>Last updated: December 2025</p>
                <p>
                    At GovAssist AI, we take your privacy seriously. This policy explains how we handle your data.
                </p>
                <h3>1. Data Collection</h3>
                <p>
                    We collect only the information necessary to provide our services, such as your email address for account creation and chat history for context.
                </p>
                <h3>2. Data Security</h3>
                <p>
                    Your data is encrypted at rest and in transit. We do not sell your personal data to third parties.
                </p>
                <h3>3. AI Interactions</h3>
                <p>
                    Please do not share sensitive personal information (like Aadhaar numbers or bank details) in the chat.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPage;
