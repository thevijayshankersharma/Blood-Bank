from django.db import models
from users.models import User, BaseModel
from django.utils import timezone
from rest_framework import serializers

import enum_helper

# Create your models here.


class Hospital(BaseModel):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    hospital_type = models.CharField(
        max_length=20, 
        choices=enum_helper.HOSPITAL_TYPE.choices
    )
    phone_number1 = models.CharField(max_length=20, unique=True)
    phone_number2 = models.CharField(max_length=20, null=True, blank=True, unique=True)
    website = models.URLField(blank=True, null=True)
    email = models.EmailField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Donor(models.Model):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='donor'
    )
    hospital = models.ForeignKey(
        Hospital,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='donor_hospital'
    )
    bag_quantity = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('approved', 'Approved'),
            ('rejected', 'Rejected'),
            ('completed', 'Completed')
        ],
        default='pending'
    )
    approval_notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.owner.username} - {self.status}"

    def save(self, *args, **kwargs):
        current_date = timezone.now()
        
        # Only run validation when creating a new record or when status is being set to 'pending'
        is_new = not self.pk
        is_changing_to_pending = 'status' in kwargs.get('update_fields', []) and self.status == 'pending'
        
        if is_new or is_changing_to_pending:
            if not self.owner.is_donor:
                raise serializers.ValidationError("User must be registered as a donor first")
            
            # Check donation frequency
            if self.owner:
                last_donation = Donor.objects.filter(
                    owner=self.owner,
                    status__in=['approved', 'completed']
                ).order_by('-created_at').first()
                
                if last_donation:
                    time_diff = current_date - last_donation.created_at
                    if time_diff.days < 90:
                        raise serializers.ValidationError(
                            f"Cannot donate. Please wait for {90-time_diff.days} days before donating again."
                        )
            
            # Check for pending donations (only if this is a new record)
            if is_new:
                has_pending = Donor.objects.filter(
                    owner=self.owner,
                    status='pending'
                ).exists()
                
                if has_pending:
                    raise serializers.ValidationError("You already have a pending donation request")

        super().save(*args, **kwargs)


class BloodBank(models.Model):
    donor = models.ManyToManyField(
        Donor,
        blank=True
    )
    hospital = models.ForeignKey(
        Hospital,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='blood_bank'
    )
    bag_quantity = models.IntegerField(default=0)
    blood_group = models.CharField(max_length=5, choices=enum_helper.BLOOD_GROUP.choices)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"{self.hospital} - {self.blood_group}"


class Recipient(BaseModel):
    blood_bank = models.ForeignKey(
        BloodBank,
        on_delete=models.CASCADE
    )
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    bag_quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.owner.get_full_name()} - {self.blood_bank.blood_group}"