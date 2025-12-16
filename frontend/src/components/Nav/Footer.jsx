import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black/20 backdrop-blur-md border-t border-white/5 mt-auto relative z-10 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Brand Section */}
                    <div className="space-y-3">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-saffron to-indiaGreen flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-saffron/30 transition-shadow">
                                G
                            </div>
                            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                GovAssist
                            </span>
                        </Link>
                        <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
                            Simplifying governance for every citizen. Precise, AI-powered guidance for schemes and documents.
                        </p>
                        <div className="flex gap-3 pt-1">
                            <a href="#" className="text-gray-400 hover:text-saffron transition-colors"><Facebook size={16} /></a>
                            <a href="#" className="text-gray-400 hover:text-saffron transition-colors"><Twitter size={16} /></a>
                            <a href="#" className="text-gray-400 hover:text-saffron transition-colors"><Instagram size={16} /></a>
                            <a href="#" className="text-gray-400 hover:text-saffron transition-colors"><Linkedin size={16} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-xs text-gray-400 hover:text-saffron transition-colors">Home</Link></li>
                            <li><Link to="/schemes" className="text-xs text-gray-400 hover:text-saffron transition-colors">Find Schemes</Link></li>
                            <li><Link to="/eligibility" className="text-xs text-gray-400 hover:text-saffron transition-colors">Check Eligibility</Link></li>
                            <li><Link to="/upload" className="text-xs text-gray-400 hover:text-saffron transition-colors">Analyze Documents</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Support</h3>
                        <ul className="space-y-2">
                            <li><Link to="/contact" className="text-xs text-gray-400 hover:text-saffron transition-colors">Contact Us</Link></li>
                            <li><Link to="/about" className="text-xs text-gray-400 hover:text-saffron transition-colors">About Us</Link></li>
                            <li><Link to="/privacy" className="text-xs text-gray-400 hover:text-saffron transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/chat" className="text-xs text-gray-400 hover:text-saffron transition-colors">AI Assistant</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Contact</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2 text-xs text-gray-400 hover:text-white transition-colors">
                                <MapPin size={14} className="flex-shrink-0 mt-0.5 text-saffron" />
                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=Ajeenkya+DY+Patil+University+Pune"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Ajeenkya DY Patil University,<br />Charholi Budruk, via Lohegaon,<br />Pune, Maharashtra 412105
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors">
                                <Mail size={14} className="flex-shrink-0 text-saffron" />
                                <a href="mailto:support@govassist.ai">support@govassist.ai</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500">
                        © {currentYear} GovAssist AI. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <Link to="#" className="text-[10px] text-gray-500 hover:text-white transition-colors">Privacy</Link>
                        <Link to="#" className="text-[10px] text-gray-500 hover:text-white transition-colors">Terms</Link>
                        <Link to="#" className="text-[10px] text-gray-500 hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
