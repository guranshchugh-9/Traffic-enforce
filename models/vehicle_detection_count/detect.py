import cv2
from ultralytics import YOLO
from collections import Counter
import argparse
import os

# Explicit vehicle class mapping for COCO dataset
VEHICLE_NAMES = {
    0: 'Person',        # Optional
    1: 'Bicycle',
    2: 'Car',
    3: 'Motorcycle',
    4: 'Airplane',      # Not a road vehicle
    5: 'Bus',
    6: 'Train',         # Not a road vehicle
    7: 'Truck',
    8: 'Boat'           # Not a road vehicle
}

# Only these will be considered for counting (you can modify this)
ROAD_VEHICLES = ['Car', 'Motorcycle', 'Bus', 'Truck', 'Bicycle']

def detect_and_count_vehicles(image_path, model_path='yolov8n.pt', conf_threshold=0.5, save_annotated=False):
    """
    Detect and count vehicles in an image with explicit class names.
    """
    # Load YOLO model
    model = YOLO(model_path)
    
    # Read image
    img = cv2.imread(image_path)
    if img is None:
        raise FileNotFoundError(f"Image not found at {image_path}")
    
    # Run inference
    results = model(img, conf=conf_threshold)
    
    # Extract class IDs
    detections = results[0].boxes
    class_ids = detections.cls.cpu().numpy().astype(int)
    
    # Count all detected objects by class name
    vehicle_counts = Counter()
    for cls_id in class_ids:
        # Get class name from explicit mapping or from model
        class_name = VEHICLE_NAMES.get(cls_id, model.names[int(cls_id)])
        vehicle_counts[class_name] += 1
    
    # Filter only road vehicles (optional, remove this if you want all)
    filtered_counts = {name: count for name, count in vehicle_counts.items() 
                       if name in ROAD_VEHICLES}
    
    # Annotate image
    annotated_img = results[0].plot()
    
    # Save if requested
    if save_annotated:
        output_path = os.path.splitext(image_path)[0] + '_annotated.jpg'
        cv2.imwrite(output_path, annotated_img)
        print(f"Annotated image saved to: {output_path}")
    
    return filtered_counts, annotated_img

def main():
    parser = argparse.ArgumentParser(description='Detect and count vehicles in an image using YOLO.')
    parser.add_argument('image', help='Path to the input image file.')
    parser.add_argument('--model', default='yolov8n.pt', help='YOLO model weights file (default: yolov8n.pt)')
    parser.add_argument('--conf', type=float, default=0.5, help='Confidence threshold (default: 0.5)')
    parser.add_argument('--save', action='store_true', help='Save annotated image')
    args = parser.parse_args()
    
    # Run detection
    counts, annotated_img = detect_and_count_vehicles(
        image_path=args.image,
        model_path=args.model,
        conf_threshold=args.conf,
        save_annotated=args.save
    )
    
    # Print results with vehicle names clearly displayed
    print("\n" + "="*50)
    print("VEHICLE DETECTION RESULTS")
    print("="*50)
    total = 0
    for vehicle, count in counts.items():
        print(f"  {vehicle}: {count}")
        total += count
    print("-"*50)
    print(f"  TOTAL VEHICLES: {total}")
    print("="*50 + "\n")
    
    # Show image
    cv2.imshow('Vehicle Detection', annotated_img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()