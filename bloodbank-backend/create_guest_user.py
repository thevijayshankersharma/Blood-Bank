import os
import django

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bloodbank.settings")
django.setup()

from django.contrib.auth import get_user_model
from allauth.account.models import EmailAddress

User = get_user_model()
from hospital.models import Hospital, BloodBank, Donor
import random

def create_guest_user():
    email = "guest@example.com"
    password = "guestpassword"
    
    try:
        user = None
        if not User.objects.filter(email=email).exists():
            print(f"Creating guest user: {email}")
            user = User.objects.create_user(username="guest", email=email, password=password)
            
            # Verify email manually so they can login if email verification is required
            EmailAddress.objects.create(user=user, email=email, verified=True, primary=True)
            print("Guest user created successfully.")
        else:
            print(f"Guest user {email} already exists.")
            user = User.objects.get(email=email)
        return user
            
    except Exception as e:
        print(f"Error creating guest user: {e}")
        return None

def create_seed_data(user):
    print("Seeding database with demo data...")
    
    # Create Hospitals
    hospitals = []
    hospital_data = [
        {"name": "City General Hospital", "address": "123 Main St, Metro City", "hospital_type": "Public", "email": "city@general.com", "phone": "555-0101"},
        {"name": "St. Mary's Medical Center", "address": "456 Oak Ave, Metro City", "hospital_type": "Private", "email": "mary@stmarys.com", "phone": "555-0102"},
        {"name": "Community Health Clinic", "address": "789 Pine Rd, Suburbia", "hospital_type": "Public", "email": "clinic@community.com", "phone": "555-0103"},
    ]

    for data in hospital_data:
        hospital, created = Hospital.objects.get_or_create(
            email=data["email"],
            defaults={
                "name": data["name"],
                "address": data["address"],
                "hospital_type": data["hospital_type"],
                "phone_number1": data["phone"],
                "website": f"https://www.{data['name'].replace(' ', '').lower()}.com"
            }
        )
        hospitals.append(hospital)
        if created:
            print(f"Created hospital: {hospital.name}")
    
    # Create Blood Bank Entries
    blood_groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    
    for hospital in hospitals:
        for bg in blood_groups:
            # Randomly decide if a hospital has this blood group stock
            if random.random() > 0.3: 
                bb, created = BloodBank.objects.get_or_create(
                    hospital=hospital,
                    blood_group=bg,
                    defaults={
                        "bag_quantity": random.randint(1, 15),
                        "is_available": True
                    }
                )
                if created:
                    print(f"Added {bg} stock to {hospital.name}")

    # Make the guest user a donor
    if not user.is_donor:
        user.is_donor = True
        user.blood_group = "O+"
        user.save()
        print("Updated guest user to be a donor (O+)")

if __name__ == "__main__":
    user = create_guest_user()
    if user:
        create_seed_data(user)
