# WSGI file for PythonAnywhere
import sys
import os

# Add the directory containing your Flask app to the path
path = '/home/YOUR_USERNAME/MyPythonAnywhere/Website/Portfolio'
if path not in sys.path:
    sys.path.append(path)

# Import your Flask app
from backend import app as application
