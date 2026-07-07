from sqlalchemy.orm import Session
from . import models,schemas
from .models import PromptHistory

def create_prompt_history(db:Session,original_prompt:str,zero_prompt:str,zero_response:str,
                          few_prompt:str,few_response:str,cot_prompt:str,cot_response:str):
    history=models.PromptHistory(
        original_prompt=original_prompt,
        zero_prompt=zero_prompt,
        zero_response=zero_response,
        few_prompt=few_prompt,
        few_response=few_response,
        cot_prompt=cot_prompt,
        cot_response=cot_response
    )
    db.add(history)
    db.commit()
    db.refresh(history)
    return history

def get_all_history(db:Session):
    return db.query(PromptHistory).order_by(PromptHistory.created_at.desc()).all()

def get_history_by_id(db:Session,history_id:int):
    return db.query(PromptHistory).filter(PromptHistory.id==history_id).first()

def delete_history(db:Session,history_id:int):
    history=get_history_by_id(db,history_id)
    if history is None:
        return None
    db.delete(history)
    db.commit()
    return history