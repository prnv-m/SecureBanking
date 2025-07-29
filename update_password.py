#!/usr/bin/env python3
"""
Simple script to update the demo user password
"""

import sqlite3
import os
from werkzeug.security import generate_password_hash

def update_password():
    DATABASE = 'backend/banking.db'
    
    if not os.path.exists(DATABASE):
        print(f"Database not found at {DATABASE}")
        return False
    
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Update password for pranav1233@gmail.com
        new_password_hash = generate_password_hash('.tie5Roanl')
        
        cursor.execute(
            "UPDATE users SET password = ? WHERE email = ?",
            (new_password_hash, 'pranav1233@gmail.com')
        )
        
        conn.commit()
        conn.close()
        
        print("✅ Password updated successfully!")
        print("Email: pranav1233@gmail.com")
        print("Password: .tie5Roanl")
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    update_password() 