import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { TeamMember } from './team.data';

interface TeamCardProps {
    member: TeamMember;
}

const TeamCard: React.FC<TeamCardProps> = ({ member }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // Handle focus for accessibility
    const handleFocus = () => setIsFlipped(true);
    const handleBlur = () => setIsFlipped(false);

    return (
        <div
            className="relative w-full aspect-[3/4] perspective-1000 group cursor-pointer"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex={0}
            role="region"
            aria-label={`Profile card for ${member.name}`}
        >
            <motion.div
                className="w-full h-full relative preserve-3d transition-all duration-300 ease-out"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{
                    duration: 0.4,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* FRONT SIDE */}
                <div
                    className="absolute inset-0 backface-hidden flex flex-col items-center justify-center bg-gray-900/40 backdrop-blur-md rounded-xl border border-gray-700/50 p-6 shadow-xl"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="w-32 h-32 mb-6 rounded-full overflow-hidden border-2 border-gray-600/50 shadow-lg relative group-hover:scale-105 transition-transform duration-500">
                        <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;
                            }}
                        />
                        {/* Subtle shiny overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                    <h3 className="text-xl font-bold text-white text-center mb-1">{member.name}</h3>
                    <p className="text-sm font-medium text-blue-400 uppercase tracking-widest">{member.role}</p>
                </div>

                {/* BACK SIDE */}
                <div
                    className="absolute inset-0 backface-hidden flex flex-col items-center justify-center bg-gray-900/95 backdrop-blur-xl rounded-xl border border-blue-500/50 p-6 shadow-neon-blue"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)'
                    }}
                >
                    <h3 className="text-xl font-bold text-white text-center mb-1">{member.name}</h3>
                    <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-4">{member.role}</p>

                    <p className="text-sm text-gray-300 text-center mb-6 leading-relaxed italic">
                        "{member.description}"
                    </p>

                    <div className="flex gap-5">
                        {member.socials.mail && (
                            <a
                                href={member.socials.mail}
                                aria-label={`Email ${member.name}`}
                                className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition-all duration-200 group/icon hover:scale-110 hover:-translate-y-1"
                            >
                                <Mail size={20} className="group-hover/icon:text-red-400 group-hover/icon:drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
                            </a>
                        )}
                        {member.socials.github && (
                            <a
                                href={member.socials.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${member.name}'s GitHub`}
                                className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition-all duration-200 group/icon hover:scale-110 hover:-translate-y-1"
                            >
                                <Github size={20} className="group-hover/icon:text-purple-400 group-hover/icon:drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
                            </a>
                        )}
                        {member.socials.linkedin && (
                            <a
                                href={member.socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${member.name}'s LinkedIn`}
                                className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition-all duration-200 group/icon hover:scale-110 hover:-translate-y-1"
                            >
                                <Linkedin size={20} className="group-hover/icon:text-blue-400 group-hover/icon:drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TeamCard;
