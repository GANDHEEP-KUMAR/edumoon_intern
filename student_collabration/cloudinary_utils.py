import cloudinary
import cloudinary.uploader # Add this import

# Configuration       
cloudinary.config( 
    cloud_name = "dtmtfmdnx", 
    api_key = "777366661777955", 
    api_secret = "U4jMkAN6sB_LyEA2ZRnEXZoCzY4", # Consider using environment variables for security
    secure=True
)

def upload_image(file_path):
    try:
        response = cloudinary.uploader.upload(file_path)
        print("Image uploaded successfully:", response)
        return response.get('secure_url')  # Use .get() to avoid KeyError
    except Exception:
        print(f"An error occurred while uploading the image:")
        return None