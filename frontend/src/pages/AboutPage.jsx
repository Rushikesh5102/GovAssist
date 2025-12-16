import React, { Suspense, lazy } from 'react';
import AboutSection from '../components/About/AboutSection';
import TechStackSection from '../components/TechStack/TechStackSection';
import TeamSection from '../components/Team/TeamSection';

const AboutPage = () => {
    return (
        <div className="min-h-screen pt-20">
            {/* About Section */}
            <AboutSection />

            {/* Mission Statement or additional content if needed, but AboutSection covers it */}

            {/* Tech Stack Section */}
            <TechStackSection />

            {/* Team Section */}
            <TeamSection />
        </div>
    );
};

export default AboutPage;
