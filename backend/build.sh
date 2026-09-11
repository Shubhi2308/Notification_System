#!/usr/bin/env bash
pip install -r requirements.txt
python manage.py migrate
python manage.py create_demo_user
python manage.py collectstatic --noinput