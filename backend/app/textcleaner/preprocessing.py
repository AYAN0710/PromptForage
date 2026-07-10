import re
import emoji
import contractions
import spacy
import inflect

nlp=spacy.load('en_core_web_sm')
ie=inflect.engine()

def number_words(text:str)->str:
    return re.sub(r"\b\d+\b",lambda match:ie.number_to_words(match.group()),text)

def clean_text(text:str) -> str:
    text=contractions.fix(text)
    text=re.sub(r"http\S+|www\S+","",text)
    text=re.sub(r"<.*?>","",text)
    text=emoji.replace_emoji(text,replace="")
    text=re.sub(r"[^A-Za-z0-9\s]","",text)
    text=number_words(text)
    text=text.lower()
    text = re.sub(r"\s+", " ", text).strip()
    #doc=nlp(text)
    return text
    
    