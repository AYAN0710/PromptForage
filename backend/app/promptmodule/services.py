from sqlalchemy.orm import Session
from . import crud
from .prompts import generate_zero_shot_prompt,generate_few_shot_prompt,generate_chain_of_thought_prompt
from .llm import get_llm_response

def generate_prompt_response(db:Session,user_prompt:str):
    zero_prompt=generate_zero_shot_prompt(user_prompt)
    few_prompt=generate_few_shot_prompt(user_prompt)
    cot_prompt=generate_chain_of_thought_prompt(user_prompt)
    zero_response=get_llm_response(zero_prompt)
    few_response=get_llm_response(few_prompt)
    cot_response=get_llm_response(cot_prompt)
    history=crud.create_prompt_history(db=db,original_prompt=user_prompt,
                                       zero_prompt=zero_prompt,zero_response=zero_response,
                                       few_prompt=few_prompt,few_response=few_response,
                                       cot_prompt=cot_prompt,cot_response=cot_response)
    return history