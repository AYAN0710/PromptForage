from paddleocr import PaddleOCR

# Load the model only once
ocr = PaddleOCR(
    use_angle_cls=True,
    lang="en"
)

def extract_text(image_path: str):

    result = ocr.ocr(image_path, cls=True)

    extracted_text = []

    if result and result[0]:
        for line in result[0]:
            extracted_text.append(line[1][0])

    return "\n".join(extracted_text)