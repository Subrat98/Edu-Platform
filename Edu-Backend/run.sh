#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================="
echo "   Edu-Backend Django REST API Server   "
echo "========================================="

# Apply migrations
python3 manage.py migrate --no-input

# Start development server
echo "Server listening at http://127.0.0.1:8000/api/"
python3 manage.py runserver 0.0.0.0:8000
