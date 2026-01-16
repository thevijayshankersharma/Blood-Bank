import os
import django

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bloodbank.settings")
django.setup()

from django.contrib.auth import get_user_model
from allauth.account.models import EmailAddress

User = get_user_model()

def create_guest_user():
    email = "guest@example.com"
    password = "guestpassword"
    
    try:
        if not User.objects.filter(email=email).exists():
            print(f"Creating guest user: {email}")
            user = User.objects.create_user(username="guest", email=email, password=password)
            
            # Verify email manually so they can login if email verification is required
            EmailAddress.objects.create(user=user, email=email, verified=True, primary=True)
            print("Guest user created successfully.")
        else:
            print(f"Guest user {email} already exists.")
            
    except Exception as e:
        print(f"Error creating guest user: {e}")

if __name__ == "__main__":
    create_guest_user()
