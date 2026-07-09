def generate_zero_shot_prompt(user_prompt: str) -> str:
    prompt = f"""{user_prompt}"""
    return prompt.strip()

def generate_few_shot_prompt(user_prompt: str) -> str:
    prompt = f""" {user_prompt}"""
    return prompt.strip()


def generate_chain_of_thought_prompt(user_prompt: str) -> str:
    prompt = f"""{user_prompt}"""
    return prompt.strip()