from fastapi import FastAPI
from .promptmodule.database import Base,engine
from .promptmodule import models
from .promptmodule.router import router
from app.textcleaner.router import router as text_router
from app.ocrmodule.router import router as ocr_router

Base.metadata.create_all(bind=engine)

app=FastAPI(title='Prompt Engineering Studio',description='Generate and compare Zero-Shot, Few-Shot and Chain-of-Thought prompts')

app.include_router(router)
app.include_router(text_router)
app.include_router(ocr_router)

@app.get('/')
def home():
    return {
        "message": "Prompt Engineering Studio."
    }