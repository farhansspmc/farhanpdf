from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import os
import aiofiles
from typing import List
from app.services.merge import merge_pdfs
from app.services.compressor import compress_pdf  # ✅ Correct import

router = APIRouter(prefix="/process", tags=["PDF Tools"])

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"

@router.post("/")
async def process_files(
    files: List[UploadFile] = File(...),
    mode: str = "ebook",
    action: str = "compress"
):
    try:
        file_paths = []

        # Save files
        for file in files:
            path = os.path.join(UPLOAD_DIR, file.filename)
            async with aiofiles.open(path, "wb") as f:
                content = await file.read()
                await f.write(content)
            file_paths.append(path)

        output_path = os.path.join(OUTPUT_DIR, "result.pdf")

        # 🔥 Actions
        if action == "compress":
            await compress_pdf(file_paths[0], output_path, mode)

        elif action == "merge":
            merge_pdfs(file_paths, output_path)

        elif action == "merge_compress":
            temp_merged = os.path.join(OUTPUT_DIR, "temp.pdf")
            merge_pdfs(file_paths, temp_merged)
            await compress_pdf(temp_merged, output_path, mode)

        return FileResponse(output_path, filename="result.pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))