from pydantic import BaseModel

class TextRequest(BaseModel):
    text:str

class CleanResponse(BaseModel):
    original:str
    cleaned:str

class keywordResponse(BaseModel):
    keywords:list[str]
    
class Entity(BaseModel):
    text:str
    label:str
    
class EntityResponse(BaseModel):
    entities: list[Entity]