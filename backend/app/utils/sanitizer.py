import re

def is_garbage_input(text: str) -> bool:
    """
    Detects if the input text is likely garbage/trash.
    Returns True if garbage, False if valid.
    """
    if not text:
        return True
        
    text = text.strip()
    
    # 1. Length check
    if len(text) < 2:
        return True
        
    # 2. Repeated characters (e.g., "aaaaaa", "hahahaha")
    if re.search(r'(.)\1{4,}', text):
        return True
        
    # 3. Keyboard mash (simple heuristic for common mash patterns)
    # e.g., "asdf", "sdfg", "qwer"
    mash_patterns = [
        r'^[asdfghjkl]{4,}$',
        r'^[zxcvbnm]{4,}$',
        r'^[qwertyuiop]{4,}$'
    ]
    for pattern in mash_patterns:
        if re.match(pattern, text.lower()):
            return True
            
    # 4. High non-alphanumeric ratio (e.g., "!!!???@@@")
    alnum_count = sum(c.isalnum() for c in text)
    if len(text) > 5 and alnum_count / len(text) < 0.3:
        return True
        
    return False

def is_valid_response(text: str) -> bool:
    """
    Checks if the LLM response is valid/useful.
    Returns True if valid, False if likely hallucination/garbage.
    """
    if not text:
        return False
        
    # Check for actionable content (links, steps)
    has_link = "http" in text
    has_steps = re.search(r'\d+\.', text) or re.search(r'- ', text)
    
    # If it's very short and has no links/steps, it might be weak
    if len(text.split()) < 10 and not (has_link or has_steps):
        # Allow short greetings though
        if any(word in text.lower() for word in ['hello', 'hi', 'namaste']):
            return True
        return False
        
    return True
