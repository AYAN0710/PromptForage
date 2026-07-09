import spacy

nlp=spacy.load("en_core_web_lg")

def extract_keywords(text:str):
    doc=nlp(text)
    keywords=[]
    for token in doc:
        if token.pos_ in ["NOUN","PROPN","ADJ"] and not token.is_stop:
            keywords.append(token.text)
    return list(set(keywords))

def extract_entities(text:str):
    doc=nlp(text)
    entities=[]
    for e in doc.ents:
        entities.append({"text":e.text,"label":e.label_})
    return entities