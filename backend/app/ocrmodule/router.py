from fastapi import APIRouter,UploadFile,File
import os
import shutil
from .service import image_to_text_service

router=APIRouter(prefix='/ocr',tags=['OCR'])

UPLOAD_DIR='app/ocrmodule/uploads'
os.makedirs(UPLOAD_DIR,exist_ok=True)

@router.post('/extract')
async def extract(file: UploadFile=File(...)):
    file_path=os.path.join(UPLOAD_DIR,file.filename)
    with open(file_path,"wb") as buffer:
        shutil.copyfileobj(file.file,buffer)
    res=image_to_text_service(file_path)
    os.remove(file_path)
    return res
    