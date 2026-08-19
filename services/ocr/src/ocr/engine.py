from paddleocr import PaddleOCR


class OCREngine:
    def __init__(self) -> None:
        self.ocr = PaddleOCR(
            # Untuk foto biasa, kita nggak perlu fitur document processing.
            use_doc_orientation_classify=False,
            use_doc_unwarping=False,
            use_textline_orientation=False,

            # Nanti kalau PaddlePaddle GPU sudah siap:
            device="gpu",
        )

    def predict(self, image_path: str):
        return self.ocr.predict(image_path)


ocr_engine = OCREngine()