from sqlalchemy import Column,Integer,Text,DateTime
from datetime import datetime,timezone
from app.database import Base

class PromptHistory(Base):
    __tablename__="prompt_history"
    
    id=Column(Integer,primary_key=True,index=True)
    original_prompt=Column(Text,nullable=False)
    zero_prompt=Column(Text,nullable=False)
    zero_response=Column(Text,nullable=False)
    few_prompt=Column(Text,nullable=False)
    few_response=Column(Text,nullable=False)
    cot_prompt=Column(Text,nullable=False)
    cot_response=Column(Text,nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))