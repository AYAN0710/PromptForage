from fastapi import FastAPI
from .database import Base,engine
from . import models
from .router import router

Base.metadata.create_all(bind=engine)

app=FastAPI(title='Prompt Engineering Studio',description='Generate and compare Zero-Shot, Few-Shot and Chain-of-Thought prompts')

app.include_router(router)

@app.get('/')
def home():
    return {
        "message": "Prompt Engineering Studio."
    }