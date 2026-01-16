from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import2 Donor, BloodBank

@receiver(post_save, sender=Donor)
def update_blood_bank_stock(sender, instance, created, **kwargs):
    if instance.status == 'approved':
        # Ensure we don't double-count if saved multiple times as approved
        # This is a basic check; real-world apps might need more robust state tracking
        # For now, we assume the transition happens once. 
        # A better way is to check if 'status' changed, but post_save doesn't give 'previous' state easily without a custom mixin.
        # However, checking if the donor is already in the M2M rel of a BloodBank helps.

        hospital = instance.hospital
        donor_user = instance.owner
        blood_group = donor_user.blood_group
        quantity = instance.bag_quantity

        if not hospital or not blood_group:
            return

        # Get or Create Blood Bank entry for this Hospital + Blood Group
        blood_bank, bb_created = BloodBank.objects.get_or_create(
            hospital=hospital,
            blood_group=blood_group,
            defaults={'bag_quantity': 0}
        )
        
        # Check if this donation is already accounted for
        if not blood_bank.donor.filter(pk=instance.pk).exists():
            print(f"Adding donation {instance.pk} to BloodBank {blood_bank.pk}")
            blood_bank.donor.add(instance)
            blood_bank.bag_quantity += quantity
            blood_bank.save()
