# Generated by Django 5.2.1 on 2025-06-11 14:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_alter_user_blood_group'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='blood_group',
            field=models.CharField(blank=True, max_length=3, null=True),
        ),
    ]
