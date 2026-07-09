from .preprocessing import clean_text
from .extractor import extract_keywords,extract_entities

def clean_service(text:str):
    cleaned_text=clean_text(text)
    return{"original":text,"cleaned":cleaned_text}

def keyword_service(text:str):
    cleaned_text=clean_text(text)
    keywords=extract_keywords(cleaned_text)
    return {"keywords":keywords}

def entity_service(text:str):
    entities=extract_entities(text)
    return {"entities":entities}