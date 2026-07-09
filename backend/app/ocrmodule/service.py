from .extractor import extract_text

def image_to_text_service(image_path:str):
    text=extract_text(image_path)
    return {"Success":True,"extracted_text":text}