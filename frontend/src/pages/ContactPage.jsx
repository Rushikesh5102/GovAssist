import React from 'react';
import { Navigation } from 'lucide-react';

const ContactPage = () => {
    return (
        <div className="min-h-screen pt-20 px-4 max-w-5xl mx-auto pb-12">
            <h1 className="text-3xl font-bold mb-6 text-white text-center">Contact Us</h1>
            <div className="glass-panel p-8">
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6 text-gray-300">
                        <p>
                            Have questions or suggestions? We'd love to hear from you. Reach out to our team using the form or the details below.
                        </p>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                            <p className="text-saffron">support@govassist.ai</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Office</h3>
                            <p>
                                Ajeenkya DY Patil University<br />
                                Charholi Budruk, via Lohegaon,<br />
                                Pune, Maharashtra 412105
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full px-4 py-2 glass-input rounded-lg"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-2 glass-input rounded-lg"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="w-full px-4 py-2 glass-input rounded-lg resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full glass-button-primary text-white font-medium py-2 px-4 rounded-lg transform hover:scale-105 transition-all"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-12 w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg border border-white/10 relative">
                    <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        title="Ajeenkya DY Patil University Map"
                        marginHeight="0"
                        marginWidth="0"
                        scrolling="no"
                        src="https://maps.google.com/maps?q=Ajeenkya%20DY%20Patil%20University&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                        style={{ filter: "invert(90%) hue-rotate(180deg)" }}
                    ></iframe>
                    <a
                        href="https://www.google.com/maps/dir/?api=1&destination=Ajeenkya+DY+Patil+University"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 glass-button-primary flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium text-white hover:scale-105 transition-transform shadow-lg z-10"
                    >
                        <Navigation size={16} />
                        Get Directions
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
