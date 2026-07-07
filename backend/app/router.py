from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from . import crud,schemas,services
from .services import generate_prompt_response
from .schemas import PromptResponse,PromptRequest

router=APIRouter(prefix='/prompts',tags=['Prompt Engineering Studio'])

@router.post('/generate',response_model=PromptResponse)
def generate_prompt(request:PromptRequest,db:Session=Depends(get_db)):
    return generate_prompt_response(db=db,user_prompt=request.prompt)

@router.get('/history',response_model=list[PromptResponse])
def get_history(db:Session=Depends(get_db)):
    return crud.get_all_history(db)

@router.delete('/history/{history_id}')
def delete_history(history_id:int,db:Session=Depends(get_db)):
    history=crud.delete_history(db,history_id)
    if history is None:
        raise HTTPException(status_code=404,detail='Prompt not found')
    return {'message':'Prompt deleted successfully !'}