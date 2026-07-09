from fastapi import APIRouter
from .schemas import TextRequest,CleanResponse,keywordResponse,EntityResponse
from .service import clean_service,keyword_service,entity_service

router=APIRouter(prefix='/text',tags=["Text Cleaner"])

@router.post('/clean',response_model=CleanResponse)
def clean_text_api(request:TextRequest):
    return clean_service(request.text)

@router.post('/keywords',response_model=keywordResponse)
def keywords_api(request:TextRequest):
    return keyword_service(request.text)

@router.post('/entities',response_model=EntityResponse)
def entities_api(request:TextRequest):
    return entity_service(request.text)