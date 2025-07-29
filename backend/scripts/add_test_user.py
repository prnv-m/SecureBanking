import sqlite3
import bcrypt
import uuid

def add_test_user():
    conn = sqlite3.connect('../banking.db')
    cursor = conn.cursor()
    
    # Test user data with specific bcrypt settings
    password = ".tie5Roanl"
    # Use work factor 12 (common Flask default)
    salt = bcrypt.gensalt(rounds=12)
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    # Verify the hash format
    if not hashed_password.startswith('$2b$'):
        raise ValueError("Invalid bcrypt hash format")
    
    user_data = {
        'id': str(uuid.uuid4()).replace('-', ''),
        'email': 'priyankaavijay@gmail.com',
        'password': hashed_password,
        'first_name': 'Priyankaa',
        'last_name': 'Vijay',
        'phone': '9876543210',
        'balance': 100000.0,
        'account_number': 'f4d41c59dd8b'
    }
    
    try:
        # First delete existing user if present
        cursor.execute('DELETE FROM users WHERE email = ?', (user_data['email'],))
        
        # Insert new user
        cursor.execute('''
            INSERT INTO users (
                id, email, password, first_name, last_name,
                phone, balance, account_number, created_at
            ) VALUES (
                :id, :email, :password, :first_name, :last_name,
                :phone, :balance, :account_number, CURRENT_TIMESTAMP
            )
        ''', user_data)
        
        conn.commit()
        
        # Verify the stored hash
        cursor.execute('SELECT password FROM users WHERE email = ?', (user_data['email'],))
        stored_hash = cursor.fetchone()[0]
        print("\n=== User Creation Results ===")
        print("User added successfully!")
        print(f"Email: {user_data['email']}")
        print(f"Account Number: {user_data['account_number']}")
        print(f"Password hash format check: {stored_hash.startswith('$2b$')}")
        print(f"Hash length check: {len(stored_hash)} characters")
        print(f"Full hash: {stored_hash}")
        
        # Verify password verification works
        verify_result = bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))
        print(f"\nPassword verification test: {'PASSED' if verify_result else 'FAILED'}")
        
    except sqlite3.IntegrityError as e:
        print(f"Error: {e}")
        print("User might already exist")
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        conn.close()

if __name__ == "__main__":
    add_test_user()