import prashantImg from '../../assets/prashant_kumbharkar.png';
import pritiImg from '../../assets/priti_satre.jpg';

export interface TeamMember {
    id: number;
    name: string;
    role: string;
    roleType: 'lead' | 'member' | 'guide';
    image: string;
    description: string;
    socials: {
        mail?: string;
        linkedin?: string;
        github?: string;
    };
}

export const teamData: TeamMember[] = [
    {
        id: 1,
        name: "RUSHIKESH PATTIWAR",
        role: "Team Lead",
        roleType: "lead",
        image: "https://github.com/Rushikesh5102.png",
        description: "Driving the project vision and architecture.",
        socials: {
            mail: "mailto:pattiwarrushikesh5102@gmail.com",
            linkedin: "https://www.linkedin.com/in/rushikeshpattiwar",
            github: "https://github.com/Rushikesh5102",
        },
    },
    {
        id: 2,
        name: "Atharva Kulkarni",
        role: "Member",
        roleType: "member",
        image: "https://github.com/7620AtharvaKulkarni.png",
        description: "Developing robust features and seamless integrations.",
        socials: {
            mail: "mailto:kulkarniatharva753@gmail.com",
            linkedin: "https://www.linkedin.com/in/atharva-kulkarni-517b58205/",
            github: "https://github.com/7620AtharvaKulkarni",
        },
    },
    {
        id: 3,
        name: "Priti Satre",
        role: "Member",
        roleType: "member",
        image: pritiImg,
        description: "Focusing on user experience and interface design.",
        socials: {
            mail: "mailto:priti.satre@adypu.edu.in",
            linkedin: "https://www.linkedin.com/in/priti-satre-a89041332",
            github: "https://github.com/pritisatre19",
        },
    },
    {
        id: 4,
        name: "Dr. Prashant Kumbharkar",
        role: "Guide",
        roleType: "guide",
        image: prashantImg,
        description: "Providing expert guidance and academic mentorship.",
        socials: {
            mail: "mailto:prashant.kumbharkar@adypu.edu.in",
            linkedin: "https://www.linkedin.com/in/dr-prashant-kumbharkar-patil-00566116",
        },
    },
];
