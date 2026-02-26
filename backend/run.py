import uvicorn
from app.main import app
import os

if __name__ == "__main__":
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("outputs", exist_ok=True)

    uvicorn.run(app, host="0.0.0.0", port=8000)