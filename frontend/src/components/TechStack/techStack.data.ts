
import {
    Code2,
    FileType,
    Globe,
    Cpu,
    Layout,
    Database,
    Server,
    Zap,
    Box,
    Layers,
    Container
} from 'lucide-react';

export interface TechItem {
    id: number;
    name: string;
    icon: any;
    color: string;
    description: string;
}

export const techStackData: TechItem[] = [
    {
        id: 1,
        name: "React",
        icon: Code2,
        color: "#61DAFB",
        description: "Frontend library for building dynamic user interfaces."
    },
    {
        id: 2,
        name: "FastAPI",
        icon: Zap,
        color: "#009688",
        description: "High-performance backend framework for Python."
    },
    {
        id: 3,
        name: "PostgreSQL",
        icon: Database,
        color: "#336791",
        description: "Robust open-source relational database system."
    },
    {
        id: 4,
        name: "TypeScript",
        icon: FileType,
        color: "#3178C6",
        description: "Typed superset of JavaScript for scalable development."
    },
    {
        id: 5,
        name: "LangChain",
        icon: Layers,
        color: "#1C3C3C", // Dark green/black mix often assoc with LangChain or we can use a generic nice color
        description: "Framework for developing applications powered by LLMs."
    },
    {
        id: 6,
        name: "Tailwind CSS",
        icon: Layout,
        color: "#38B2AC",
        description: "Utility-first CSS framework for rapid UI design."
    },
    {
        id: 7,
        name: "SQLAlchemy",
        icon: Server,
        color: "#D71F00",
        description: "Python SQL toolkit and Object Relational Mapper."
    },
    {
        id: 8,
        name: "AI/LLM",
        icon: Cpu,
        color: "#10B981",
        description: "Powered by advanced Large Language Models."
    },
    {
        id: 9,
        name: "Python",
        icon: Globe,
        color: "#3776AB",
        description: "Core programming language for backend logic."
    },
    {
        id: 10,
        name: "Vite",
        icon: Box,
        color: "#BD34FE",
        description: "Next Generation Frontend Tooling."
    },
];
