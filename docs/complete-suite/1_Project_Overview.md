# GovAssist: Project Overview

## 1. Introduction
GovAssist is an intelligent, AI-powered platform designed to bridge the massive gap between citizens and government welfare schemes. Despite the existence of thousands of government schemes designed to uplift various demographics, millions of citizens remain unaware or unable to navigate the complex eligibility criteria and application procedures. 

GovAssist solves this problem by providing a conversational AI assistant, dynamic eligibility checking, and an automated backend that simplifies governance for every citizen.

## 2. Problem Statement
*   **Information Asymmetry:** Citizens lack awareness of the schemes they are eligible for.
*   **Complex Bureaucracy:** Government documents and scheme descriptions are written in complex legal/administrative language.
*   **Fragmented Systems:** Information is scattered across hundreds of different state and central portals.
*   **Language Barriers:** Most portals are not easily accessible to regional language speakers.

## 3. Proposed Solution
GovAssist centralizes government scheme discovery using a scalable, modern technology stack. 
*   **AI Chat Assistant (RAG Pipeline):** Users can chat in natural language to ask questions about schemes. The system retrieves contextual documents (FAISS Vector Store) and uses Large Language Models (LLMs) to generate accurate, easy-to-understand answers.
*   **Eligibility Engine:** A deterministic rule engine that matches user profiles (Age, Income, Caste, Occupation) against a dynamically updated database of schemes.
*   **Document Analysis:** Optical Character Recognition (OCR) allows users to upload complex government notices and receive simplified summaries.

## 4. Key Objectives
1.  To develop a scalable, cloud-ready web application using React and FastAPI.
2.  To integrate Retrieval-Augmented Generation (RAG) for accurate, hallucination-free AI responses.
3.  To build a secure, role-based ecosystem (Citizen, Admin, Owner) with a real-time DevOps dashboard.
4.  To automate data ingestion through a scheduled Python web scraping pipeline.

## 5. Target Audience
*   **Citizens (Students, Farmers, Business Owners):** Seeking financial aid, scholarships, or subsidies.
*   **NGOs & Social Workers:** Using the platform to assist underprivileged communities in discovering benefits.
*   **Government Administrators (Future Scope):** Using the analytics dashboard to see which demographics are searching for which schemes.
