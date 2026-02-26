from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import compress

app = FastAPI()

# ✅ CORS fix for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(compress.router)

@app.get("/")
def root():
    return {"message": "API Running"}