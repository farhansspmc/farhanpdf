import asyncio

GHOSTSCRIPT_QUALITY = {
    "screen": "/screen",
    "ebook": "/ebook",
    "printer": "/printer"
}

async def compress_pdf(input_path, output_path, mode="ebook"):
    quality = GHOSTSCRIPT_QUALITY.get(mode, "/ebook")

    command = [
        "gswin64c",  # Windows Ghostscript
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        f"-dPDFSETTINGS={quality}",
        "-dNOPAUSE",
        "-dQUIET",
        "-dBATCH",
        f"-sOutputFile={output_path}",
        input_path
    ]

    process = await asyncio.create_subprocess_exec(*command)
    await process.communicate()

    if process.returncode != 0:
        raise Exception("Compression failed")