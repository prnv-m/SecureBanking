#!/usr/bin/env python3
"""
Script to update the demo user password from demo123 to .tie5Roanl
This script updates both the database and the frontend Login.tsx file.
"""

import sqlite3
import re
import os
from werkzeug.security import generate_password_hash, check_password_hash

def update_database_password():
    """Update the password in the database"""
    
    # Database path
    DATABASE = 'backend/banking.db'
    
    # Check if database exists
    if not os.path.exists(DATABASE):
        print(f"Error: Database file '{DATABASE}' not found!")
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
        
        print("✅ Database password updated successfully!")
        print(f"User: pranav1233@gmail.com")
        print(f"New password: .tie5Roanl")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"Error updating database password: {e}")
        return False

def update_frontend_credentials():
    """Update the demo credentials in the Login.tsx file"""
    
    login_file_path = 'client/pages/Login.tsx'
    
    # Check if file exists
    if not os.path.exists(login_file_path):
        print(f"Error: Login.tsx file not found at '{login_file_path}'!")
        return False
    
    try:
        # Read the current file
        with open(login_file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Update the password in the demo credentials section
        # Find the line with the password and replace it
        old_password_line = '                  <strong>Password:</strong> demo123'
        new_password_line = '                  <strong>Password:</strong> .tie5Roanl'
        
        if old_password_line in content:
            updated_content = content.replace(old_password_line, new_password_line)
            
            # Write the updated content back to the file
            with open(login_file_path, 'w', encoding='utf-8') as file:
                file.write(updated_content)
            
            print("✅ Frontend credentials updated successfully!")
            print("Updated Login.tsx with new demo password")
            return True
        else:
            print("Warning: Could not find the old password line in Login.tsx")
            print("The file might have been modified. Please check manually.")
            return False
            
    except Exception as e:
        print(f"Error updating frontend credentials: {e}")
        return False

def verify_password_update():
    """Verify that the password was updated correctly in the database"""
    
    DATABASE = 'backend/banking.db'
    
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Get current password hash
        cursor.execute("SELECT password FROM users WHERE email = ?", ('pranav1233@gmail.com',))
        result = cursor.fetchone()
        
        if result:
            current_hash = result[0]
            
            # Test if the new password works
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

def main():
    print("🔐 SecureBank Demo Password Update Script")
    print("=" * 50)
    print("This script will update the demo user password from 'demo123' to '.tie5Roanl'")
    print("=" * 50)
    
    # Update database password
    print("\n1. Updating database password...")
    db_success = update_database_password()
    
    # Update frontend credentials
    print("\n2. Updating frontend credentials...")
    frontend_success = update_frontend_credentials()
    
    # Verify the update
    print("\n3. Verifying password update...")
    verify_success = verify_password_update()
    
    # Summary
    print("\n" + "=" * 50)
    print("UPDATE SUMMARY:")
    print(f"Database update: {'✅ Success' if db_success else '❌ Failed'}")
    print(f"Frontend update: {'✅ Success' if frontend_success else '❌ Failed'}")
    print(f"Password verification: {'✅ Success' if verify_success else '❌ Failed'}")
    
    if db_success and frontend_success and verify_success:
        print("\n🎉 All updates completed successfully!")
        print("You can now login with:")
        print("Email: pranav1233@gmail.com")
        print("Password: .tie5Roanl")
    else:
        print("\n⚠️  Some updates failed. Please check the errors above.")

if __name__ == "__main__":
    main() 