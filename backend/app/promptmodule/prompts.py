def generate_zero_shot_prompt(user_prompt: str) -> str:
    return f"""
    You are a helpful AI assistant.
    Answer the following query clearly and concisely in less than 50 words.
    User Query:
    {user_prompt}""".strip()

def generate_few_shot_prompt(user_prompt: str) -> str:
    return f"""
    You are a helpful AI assistant.
    Example 1
    User:What is Python?
    Assistant:Python is a high-level programming language used for web development, AI, automation, and data science.
    -----------------------
    Example 2
    User:Tell me about Lionel Messi.
    Assistant:Lionel Messi is an Argentine footballer regarded as one of the greatest players in football history.
    -----------------------
    Now answer the following in few shot prompting

    User:
    {user_prompt}
    Assistant:
    """.strip()


def generate_chain_of_thought_prompt(user_prompt: str) -> str:
    return f"""
    You are an expert AI assistant.
    Before answering, reason step by step internally use chain of thoughts.
    Use this process:
    1. Understand the user's request.
    2. Identify the important information.
    3. Organize the answer.
    4. Give a concise final response.
    Do NOT reveal your reasoning.
    Only provide the final answer.
    User Query:
    {user_prompt}""".strip()