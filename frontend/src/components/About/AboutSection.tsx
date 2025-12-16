import React from 'react';
import { motion } from 'framer-motion';

const AboutSection: React.FC = () => {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-white/90">
                        About GovAssist
                    </h2>

                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-10 rounded-full" />

                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light mb-8">
                        GovAssist is an intelligent platform designed to bridge the gap between citizens and government services.
                        We leverage advanced AI to simplify the discovery and understanding of government schemes,
                        ensuring that every citizen can access the benefits they are entitled to with ease and clarity.
                    </p>

                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                        Our mission is to democratize access to public welfare through technology,
                        making complex bureaucratic processes transparent, accessible, and user-friendly for everyone.
                    </p>
                </motion.div>
            </div>

            {/* Subtle Background Elements */}
            <div className="absolute top-1/2 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-1/2 right-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
        </section>
    );
};

export default AboutSection;
