from app.services.llm_connector import llm_connector
import sys
import os

# Hack to import adapter from parent directory if running as script
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))
from adapters.faiss_adapter import faiss_adapter

def get_rag_response(query: str, history: list = []):
    # 1. Retrieve relevant documents
    docs = faiss_adapter.similarity_search(query, k=4)
    
    # Format history (Limit to last 10 messages to save tokens)
    history_text = ""
    if history:
        recent_history = history[-10:]
        history_text = "\n\nConversation History:\n" + "\n".join([f"{msg['role']}: {msg['content']}" for msg in recent_history])

    # 2. Construct context
    if docs:
        context_text = "\n\n".join([doc.page_content for doc in docs])
        system_prompt = """You are GovAssist, a helpful AI assistant for Indian Government schemes and documents.
Use the following pieces of retrieved context and the conversation history to answer the user's question.
If the context doesn't contain the answer, or if the user is asking a general question (like greeting), answer from your general knowledge.
Do not make up facts about specific government schemes if you don't know them.

IMPORTANT FORMATTING RULES:
1. **Structure**: Use clear headings and bullet points.
2. **Steps**: If explaining a process, use numbered lists (1., 2., 3.).
3. **Links**: If you know the official website or application link, provide it in a dedicated section at the end called "Important Links".
4. **Clarity**: Use simple language accessible to all citizens.

If the user's input is gibberish or unintelligible, politely ask them to rephrase.

Context:
{context}

{history}
"""
        formatted_prompt = system_prompt.format(context=context_text, history=history_text)
    else:
        formatted_prompt = """You are GovAssist, a helpful AI assistant for Indian Government schemes.
The user has asked a question, but no specific documents were found in the database.
Answer the user's question from your general knowledge. Be helpful and polite.
If the question is about a specific scheme that you don't know about, admit it and suggest they upload the relevant document.

IMPORTANT FORMATTING RULES:
1. **Structure**: Use clear headings and bullet points.
2. **Steps**: If explaining a process, use numbered lists.
3. **Links**: Provide official links if known.

{history}
"""
        formatted_prompt = formatted_prompt.format(history=history_text)

    # 3. Generate response
    answer = llm_connector.generate_response(formatted_prompt, query)
    
    # Post-filter check
    from app.utils.sanitizer import is_valid_response
    if not is_valid_response(answer):
        answer = "I couldn't produce a dependable response based on the available information. Here are some steps you can try:\n1. Rephrase your question with more specific details.\n2. Upload a relevant document if you have one.\n3. Check official government portals directly."
    
    # 4. Format sources
    sources = [{"title": doc.metadata.get("source", "Unknown"), "content": doc.page_content[:100] + "..."} for doc in docs] if docs else []
    
    return {
        "answer": answer,
        "sources": sources
    }
