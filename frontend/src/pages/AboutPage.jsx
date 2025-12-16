import React from 'react';

const AboutPage = () => {
    return (
        <div className="min-h-screen pt-20 px-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-white text-center">About GovAssist AI</h1>
            <div className="glass-panel p-8 prose-lg">
                <div className="space-y-6 text-gray-300">
                    <p>
                        GovAssist AI is dedicated to simplifying the complexity of government schemes for every citizen.
                        Our mission is to bridge the gap between people and public services using advanced artificial intelligence.
                    </p>
                    <h3 className="text-xl font-semibold text-white mt-8 mb-4">Our Mission</h3>
                    <p>
                        We believe that accessing government benefits should be straightforward and transparent.
                        By leveraging state-of-the-art AI, we provide accurate, real-time assistance to help you understand eligibility,
                        application processes, and required documentation for various schemes.
                    </p>
                    <h3 className="text-xl font-semibold text-white mt-8 mb-4">How It Works</h3>
                    <p>
                        Our platform aggregates information from official sources and uses natural language processing to answer your queries simply and accurately.
                        Whether you are looking for education scholarships, agricultural subsidies, or healthcare benefits, GovAssist AI is here to guide you.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
