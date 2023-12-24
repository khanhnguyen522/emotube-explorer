from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from hume import HumeStreamClient
from hume.models.config import LanguageConfig
import os
from collections import defaultdict
from typing import List
from pydantic import BaseModel
from dotenv import load_dotenv

class Comment(BaseModel):
    comment_data: List[str]

app = FastAPI()

#load .env file
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=dotenv_path)

#prevent cors
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/api/explore')
async def analyze(comment: Comment):
    client = HumeStreamClient(os.getenv("HUMEAI_API_KEY"))
    config = LanguageConfig()
    result = []
    comment_and_emotions = []

    async with client.connect([config]) as socket:
        for sample in comment.comment_data:
            result = await socket.send_text(sample)
            emotions = result["language"]["predictions"][0]["emotions"]

            comment_and_emotions.append([sample, emotions])
            
            total_scores = defaultdict(float)
            count_per_emotion = defaultdict(int)
            for emotion in emotions:
                total_scores[emotion["name"]] += emotion["score"]
                count_per_emotion[emotion["name"]] += 1
            #calc mean scores
            mean_scores = {}
            for emotion in total_scores:
                mean_scores[emotion] = total_scores[emotion] / count_per_emotion[emotion]
            #rank emotions based on mean scores
            sorted_emotions = sorted(mean_scores.items(), key=lambda x: x[1], reverse=True)

            #round ranked_emotions to 2 decimal places
            sorted_emotions = [(emotion, round(score, 2)) for emotion, score in sorted_emotions]
            
        emotion_dict = {}
        for emotion, score in sorted_emotions[:5]:
            if emotion not in emotion_dict:
                emotion_dict[emotion] = score
        
        result = [[emotion, score] for emotion, score in emotion_dict.items()]

        for emotion in comment_and_emotions:
            name, scores = emotion
            scores.sort(key=lambda x: x["score"], reverse=True)
            emotion[1] = scores[:5]

        return {"result": result, "comment_and_emotions": comment_and_emotions}