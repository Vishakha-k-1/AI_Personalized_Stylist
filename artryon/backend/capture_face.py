import cv2
import os

def capture_face():
    cap = cv2.VideoCapture(0)  # Default for Linux/macOS
    if not cap.isOpened():
        print("Error: Could not open camera")
        return None

    ret, frame = cap.read()
    cap.release()  # Release immediately after capturing

    if not ret:
        print("Error: Failed to capture image")
        return None

    img_path = "captured_face.jpg"
    cv2.imwrite(img_path, frame)  # Save image

    print(f"✅ Image saved as {img_path}")

    # Skip cv2.imshow() in Codespaces
    if "CODESPACES" not in os.environ:
        captured_img = cv2.imread(img_path)
        cv2.imshow("Captured Image", captured_img)
        cv2.waitKey(3000)  # Show for 3 seconds
        cv2.destroyAllWindows()

    return img_path

# Run the function
if __name__ == "__main__":
    capture_face()
