import os
from pathlib import Path
import cv2
from fast_alpr.alpr import ALPR

def main():
    # Initialize the ALPR system with default models:
    # Detector: yolo-v9-t-384-license-plate-end2end
    # OCR: cct-xs-v2-global-model
    print("Initializing ALPR...")
    alpr = ALPR()
    
    # Path to assets
    assets_dir = Path("assets/images")
    results_dir = Path("assets/results")
    results_dir.mkdir(parents=True, exist_ok=True)
    
    # Supported image formats
    image_extensions = [".png", ".jpg", ".jpeg", ".webp"]
    
    # Find all test images (excluding result files)
    image_paths = [
        p for p in assets_dir.iterdir()
        if p.suffix.lower() in image_extensions
    ]
    
    if not image_paths:
        print("No test images found in assets/images/")
        return
        
    print(f"Found {len(image_paths)} images to test: {[p.name for p in image_paths]}")
    
    # Text file to store predictions
    results_txt_path = results_dir / "results.txt"
    
    with open(results_txt_path, "w", encoding="utf-8") as txt_file:
        txt_file.write("FastALPR Test Detection and Recognition Results\n")
        txt_file.write("==============================================\n\n")
        
        for img_path in image_paths:
            print(f"\nProcessing {img_path.name}...")
            
            # Read the image
            img = cv2.imread(str(img_path))
            if img is None:
                print(f"Error: Could not read {img_path}")
                txt_file.write(f"Image: {img_path.name}\n  Error: Could not load image\n\n")
                continue
                
            # Run ALPR and draw predictions
            drawn_result = alpr.draw_predictions(img)
            
            # Print detected text and confidence values
            results = drawn_result.results
            txt_file.write(f"Image: {img_path.name}\n")
            
            if not results:
                print("  No license plates detected.")
                txt_file.write("  No license plates detected.\n")
            else:
                for idx, res in enumerate(results, 1):
                    bbox = res.detection.bounding_box
                    conf_detect = res.detection.confidence
                    
                    ocr_text = "N/A"
                    ocr_conf = "N/A"
                    if res.ocr is not None:
                        ocr_text = res.ocr.text
                        ocr_conf = f"{res.ocr.confidence:.2%}" if isinstance(res.ocr.confidence, float) else str(res.ocr.confidence)
                    
                    print(f"  Plate #{idx}:")
                    print(f"    Bounding Box: [{bbox.x1}, {bbox.y1}, {bbox.x2}, {bbox.y2}]")
                    print(f"    Detection Confidence: {conf_detect:.2%}")
                    print(f"    OCR Text: {ocr_text}")
                    print(f"    OCR Confidence: {ocr_conf}")
                    
                    # Write to output text file
                    txt_file.write(
                        f"  - Plate #{idx}: {ocr_text}\n"
                        f"    OCR Confidence: {ocr_conf}\n"
                        f"    Detection Confidence: {conf_detect:.2%}\n"
                        f"    Bounding Box: [{bbox.x1}, {bbox.y1}, {bbox.x2}, {bbox.y2}]\n"
                    )
            txt_file.write("\n")
            
            # Save annotated image
            output_filename = f"{img_path.stem}_result.png"
            output_path = results_dir / output_filename
            cv2.imwrite(str(output_path), drawn_result.image)
            print(f"  Saved annotated output to: {output_path}")

    print(f"\nAll results successfully compiled to: {results_txt_path}")

if __name__ == "__main__":
    main()
