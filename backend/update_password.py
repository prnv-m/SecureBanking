#!/usr/bin/env python3
"""
Script to update the password for the demo user from demo123 to .tie5Roanl
"""

import sqlite3
from werkzeug.security import generate_password_hash
import os

def update_demo_password():
    """Update the password for the demo user"""
    
    # Database path
    DATABASE = 'banking.db'
    
    # Check if database exists
    if not os.path.exists(DATABASE):
        print(f"Error: Database file '{DATABASE}' not found!")
        print("Make sure you're running this script from the backend directory.")
        return False
    
    try:
        # Connect to database
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT id, email FROM users WHERE email = ?", ('pranav1233@gmail.com',))
        user = cursor.fetchone()
        
        if not user:
            print("Error: User 'pranav1233@gmail.com' not found in database!")
            print("Available users:")
            cursor.execute("SELECT email FROM users")
            users = cursor.fetchall()
            for user_email in users:
                print(f"  - {user_email[0]}")
            return False
        
        # Generate new password hash
        new_password_hash = generate_password_hash('.tie5Roanl')
        
        # Update the password
        cursor.execute(
            "UPDATE users SET password = ? WHERE email = ?",
            (new_password_hash, 'pranav1233@gmail.com')
        )
        
        # Commit changes
        conn.commit()
        
        print("✅ Password updated successfully!")
        print(f"User: pranav1233@gmail.com")
        print(f"New password: .tie5Roanl")
        print(f"Password hash: {new_password_hash[:50]}...")
        
        # Verify the update
        cursor.execute("SELECT password FROM users WHERE email = ?", ('pranav1233@gmail.com',))
        updated_hash = cursor.fetchone()[0]
        print(f"Verified hash in database: {updated_hash[:50]}...")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"Error updating password: {e}")
        return False

def verify_password_update():
    """Verify that the password was updated correctly"""
    
    DATABASE = 'banking.db'
    
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Get current password hash
        cursor.execute("SELECT password FROM users WHERE email = ?", ('pranav1233@gmail.com',))
        result = cursor.fetchone()
        
        if result:
            current_hash = result[0]
            print(f"Current password hash: {current_hash[:50]}...")
            
            # Test if the new password works
            from werkzeug.security import check_password_hash
            if check_password_hash(current_hash, '.tie5Roanl'):
                print("✅ Password verification successful!")
                return True
            else:
                print("❌ Password verification failed!")
                return False
        else:
            print("❌ User not found!")
            return False
            
    except Exception as e:
        print(f"Error verifying password: {e}")
        return False
    finally:
        conn.close()

if __name__ == "__main__":
    print("🔐 SecureBank Password Update Script")
    print("=" * 40)
    
    # Update the password
    if update_demo_password():
        print("\n" + "=" * 40)
        print("Verifying password update...")
        verify_password_update()
    else:
        print("\n❌ Password update failed!") 