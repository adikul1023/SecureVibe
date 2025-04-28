# Test file for SecureVibe extension

# Exposed API key
import hashlib
import os
from xml.dom.minidom import Element
import requests


api_key = "sk_test_1234567890abcdef"

# Hardcoded password
password = "super_secret_password123"

def execute_query(query):
    raise NotImplementedError

# SQL injection vulnerability
def get_user_data(user_id):
    query = "SELECT * FROM users WHERE id = " + user_id
    return execute_query(query)

# XSS vulnerability
def display_user_info(user_input):
    Element.innerHTML = user_input

# Unsafe file operation
def read_config():
    with open("config.txt", "r") as f:
        return f.read()

# Missing input validation
def process_user_input():
    user_input = input("Enter your name: ")
    return user_input

# Insecure HTTP
def fetch_data():
    response = requests.get("http://api.example.com/data")
    return response.json()

# Debug statement
print("Debug: Processing user data")

# Weak cryptography
def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest()

# Insecure deserialization
def load_user_data(data):
    return eval(data)

# Command injection
def execute_command(command):
    os.system(command) 