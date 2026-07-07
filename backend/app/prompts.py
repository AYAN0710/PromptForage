def generate_zero_shot_prompt(user_prompt: str) -> str:
    prompt = f"""Some instructions{user_prompt}"""
    return prompt.strip()

def generate_few_shot_prompt(user_prompt: str) -> str:
    prompt = f""" some instructions{user_prompt}"""
    return prompt.strip()


def generate_chain_of_thought_prompt(user_prompt: str) -> str:
    prompt = f"""some instructructions{user_prompt}"""
    return prompt.strip()