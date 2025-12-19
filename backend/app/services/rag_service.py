from app.services.llm_connector import llm_connector
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.scheme import Scheme
import sys
import os

def get_rag_response(query: str, db: Session, history: list = [], language: str = "en"):
    # 1. Retrieve relevant schemes from Database (Keyword Search)
    # Simple strategy: Search for schemes where name or description contains the query terms
    # We'll search for the full query string first, then fall back to partial words if needed.
    # For MVP, just search for ANY of the query words? Or the full phrase?
    # Let's try searching for the full phrase or key terms.
    
    # 1. Retrieve relevant schemes from Database (Keyword Search)
    keywords = query.split()
    
    # 1. Try Full Phrase Match first (High Precision)
    filter_full = or_(
        Scheme.name.ilike(f"%{query}%"),
        Scheme.description.ilike(f"%{query}%"),
        Scheme.tags.ilike(f"%{query}%")
    )
    matched_schemes = db.query(Scheme).filter(filter_full).filter(Scheme.active == True).limit(5).all()
    
    # 2. If < 3 matches, try Individual Keywords (High Recall)
    if len(matched_schemes) < 3:
        # Filter insignificant words
        stop_words = {"what", "where", "how", "when", "which", "schemes", "scheme", "for", "the", "are", "is", "does", "give", "me", "tell", "about"}
        significant_keywords = [k for k in keywords if k.lower() not in stop_words and len(k) > 2]
        
        if significant_keywords:
            conditions = []
            for k in significant_keywords:
                term = k
                # Simple de-pluralization (farmer -> farmers, farmers -> farmer)
                # If term ends in 's', try removing it to match singular in DB
                if term.lower().endswith('s'):
                     term_root = term[:-1]
                     conditions.append(Scheme.tags.ilike(f"%{term_root}%"))
                     conditions.append(Scheme.description.ilike(f"%{term_root}%"))
                     conditions.append(Scheme.name.ilike(f"%{term_root}%"))
                
                # Also search for the term as-is
                conditions.append(Scheme.tags.ilike(f"%{term}%"))
                conditions.append(Scheme.description.ilike(f"%{term}%"))
                conditions.append(Scheme.name.ilike(f"%{term}%"))
            
            filter_keywords = or_(*conditions)
            
            # Fetch more, excluding already found
            existing_ids = [s.id for s in matched_schemes]
            more_schemes = db.query(Scheme).filter(filter_keywords)\
                                           .filter(Scheme.active == True)\
                                           .filter(~Scheme.id.in_(existing_ids) if existing_ids else True)\
                                           .limit(5 - len(matched_schemes)).all()
            matched_schemes.extend(more_schemes)

    # 2. Construct context
    context_text = ""
    if matched_schemes:
        context_parts = []
        for scheme in matched_schemes:
            part = f"""
            Name: {scheme.name}
            Ministry: {scheme.ministry}
            Description: {scheme.description}
            Benefits: {scheme.benefits}
            Eligibility: {scheme.eligibility_criteria}
            """
            context_parts.append(part)
        context_text = "\n---\n".join(context_parts)
    
    # Format history (Limit to last 5 messages to save tokens)
    history_text = ""
    if history:
        recent_history = history[-5:]
        history_text = "\n\nConversation History:\n" + "\n".join([f"{msg['role']}: {msg['content']}" for msg in recent_history])

    # 3. Create Prompt
    system_prompt = f"""You are GovAssist, a helpful AI assistant for Indian Government schemes.
Use the following retrieved scheme details to answer the user's question accurately.

If the context contains the answer, verify the details (eligibility, benefits) before stating them.
If the context does NOT contain the answer, answer from your general knowledge but clearly state that you are checking general sources.
Do not hallucinate specific amounts or dates if they are not in the context.

Language: {language}

Context:
{context_text}

{history_text}

Question: {query}
"""

    # 4. Generate response
    answer = llm_connector.generate_response(system_prompt, query)
    
    # 5. Format sources
    sources = [{"title": s.name, "content": s.description[:100] + "..."} for s in matched_schemes] if matched_schemes else []
    
    return {
        "answer": answer,
        "sources": sources
    }
