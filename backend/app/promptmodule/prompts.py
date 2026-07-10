def generate_zero_shot_prompt(user_prompt: str) -> str:
    return f"""
    You are a helpful AI assistant.
    Answer the following query clearly and concisely in less than 50 words.
    User Query:
    {user_prompt}""".strip()

def generate_few_shot_prompt(user_prompt: str) -> str:
    return f"""
    Act as an expert assistant. Follow the pattern of the examples below to complete the final task.
    Example 1:
    Input: [Provide an example input]
    Output: [Provide the exact output you want]
    Example 2:
    Input: [Provide another example input]
    Output: [Provide the exact output you want]
    Example 3:
    Input: [Provide a third example input]
    Output: [Provide the exact output you want]

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