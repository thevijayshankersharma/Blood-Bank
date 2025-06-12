from django.contrib import admin
from django.db import models
from hospital.models import Hospital, BloodBank, Recipient, Donor


# Register your models here.


@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'phone_number1',)

@admin.register(BloodBank)
class BloodBankAdmin(admin.ModelAdmin):
    list_display = ('hospital', 'blood_group', 'bag_quantity', )

@admin.register(Recipient)
class RecipientAdmin(admin.ModelAdmin):
    list_display = ('blood_bank', 'owner','bag_quantity', )

@admin.register(Donor)
class DonorAdmin(admin.ModelAdmin):
    list_display = ('owner', 'hospital', 'bag_quantity', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    actions = ['approve_donation', 'reject_donation']

    def approve_donation(self, request, queryset):
        """Approve selected donation requests"""
        approved_count = 0
        
        for donor in queryset.filter(status='pending'):
            try:
                # Update blood bank quantity first
                blood_bank = BloodBank.objects.get(
                    hospital=donor.hospital,
                    blood_group=donor.owner.blood_group
                )
                
                # Update blood bank quantity
                blood_bank.bag_quantity = models.F('bag_quantity') + 1
                blood_bank.save()
                
                # Update donor status and bag quantity using update() to avoid calling save()
                Donor.objects.filter(pk=donor.pk).update(
                    status='approved',
                    bag_quantity=models.F('bag_quantity') + 1
                )
                approved_count += 1
                
            except BloodBank.DoesNotExist:
                self.message_user(
                    request,
                    f"Could not find matching blood bank for donor {donor.id}",
                    level='error'
                )
            except Exception as e:
                self.message_user(
                    request,
                    f"Error approving donation {donor.id}: {str(e)}",
                    level='error'
                )
        
        if approved_count > 0:
            self.message_user(
                request,
                f"Successfully approved {approved_count} donation(s)",
                level='success'
            )
    approve_donation.short_description = "Approve selected donations"

    def reject_donation(self, request, queryset):
        """Reject selected donation requests"""
        updated = queryset.filter(status='pending').update(status='rejected')
        
        if updated > 0:
            self.message_user(
                request,
                f"Successfully rejected {updated} donation(s)",
                level='success'
            )
        else:
            self.message_user(
                request,
                "No pending donations were selected",
                level='warning'
            )
    reject_donation.short_description = "Reject selected donations"