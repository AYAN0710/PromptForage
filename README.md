PromptForge is a mini project built to explore prompt engineering concepts, FastAPI backend development, and basic Natural Language Processing (NLP). The application provides APIs for prompt generation, text preprocessing, OCR-based text extraction, and maintains a history of generated prompts.

The project was developed as a learning exercise to understand backend architecture, API design, and the integration of NLP libraries with LLMs.

## Features

### Prompt Generation
- Generate prompts using:
  - Zero-Shot Prompting
  - Few-Shot Prompting
  - Chain-of-Thought Prompting

### Text Cleaning
- Expand contractions
- Remove URLs
- Remove HTML tags
- Remove emojis
- Remove unwanted special characters
- Normalize whitespace
- Convert numbers to words

### NLP Utilities
- Keyword Extraction
- Named Entity Recognition (NER)

### OCR
- Extract text from uploaded images using PaddleOCR.

### Prompt History
- Store generated prompts and responses using SQLite.
- Also created get_all_prompts api , prompt_history api but not added to keep the project simpler.
- One can see the api endpoints in the swagger docs of fastapi module wise.

 ## Tech Stack

### Backend
Python, FastAPI, SQLAlchemy, SQLite, Pydantic.

### NLP
spaCy, NLTK, RegEx, Inflect

### OCR
PaddleOCR

### Frontend (made with the help of AI to achieve make the UI look good, because main task was to learn the backend part though the JS part might look big due to the frontend animated background)

## API Modules

### Prompt Module
- Generate Zero-Shot prompts
- Generate Few-Shot prompts
- Generate Chain-of-Thought prompts
- Store prompt history

### Text Cleaner Module
- Clean raw text
- Extract keywords
- Perform Named Entity Recognition

### OCR Module
- Upload image
- Extract text from image

 ## Purpose
This project was created as a mini project to gain hands-on experience with:

- FastAPI application structure
- REST API development
- Prompt engineering concepts
- Basic NLP techniques using spaCy and NLTK
- OCR integration
- SQLite and SQLAlchemy

It is intended as a learning project rather than a production-ready application.

