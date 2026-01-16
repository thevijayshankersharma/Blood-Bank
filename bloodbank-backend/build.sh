#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies (only required for some platforms if not done automatically)
pip install -r requirements.txt

# Convert static asset files
python manage.py collectstatic --no-input

# Apply any outstanding database migrations
python manage.py migrate

# Create Guest User for Demo
python create_guest_user.py
