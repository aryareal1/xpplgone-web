from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import FastAPI, File, HTTPException, UploadFile

from .engine import ocr_engine


app = FastAPI(
    title="XIRPL OCR Service",
    version="0.1.0",
)


ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


@app.get("/health")
async def health():
    return {
        "status": "ok",
    }


@app.post("/ocr")
async def ocr(file: UploadFile = File(...)):
    # Validate content type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="File must be JPEG, PNG, or WebP",
        )

    # Simpan upload ke temporary file
    suffix = Path(file.filename or "").suffix or ".jpg"

    with NamedTemporaryFile(
        suffix=suffix,
        delete=False,
    ) as temp:
        temp_path = Path(temp.name)

        content = await file.read()
        temp.write(content)

    try:
        results = ocr_engine.predict(str(temp_path))

        output = []

        for result in results:
            # PaddleOCR result object menyediakan json representation.
            data = result.json

            output.append(data)

        return {
            "success": True,
            "results": output,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"OCR processing failed: {error}",
        )

    finally:
        temp_path.unlink(missing_ok=True)


def main():
    import uvicorn

    uvicorn.run(
        "ocr.main:app",
        host="0.0.0.0",
        port=3613,
        reload=False,
    )


if __name__ == "__main__":
    main()