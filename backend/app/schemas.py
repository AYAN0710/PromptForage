from pydantic import BaseModel,Field,ConfigDict
from datetime import datetime,timezone

class PromptRequest(BaseModel):
    prompt:str=Field(...,min_length=5,max_length=5000,description='Prompt that the user will enter')
    
class PromptResponse(BaseModel):
    id:int
    original_prompt:str
    zero_prompt:str
    zero_response:str
    few_prompt:str
    few_response:str
    cot_prompt:str
    cot_response:str
    created_at:datetime
    model_config=ConfigDict(from_attributes=True)   