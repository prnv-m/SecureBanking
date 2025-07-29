import sqlite3
import uuid

def add_test_users_dev():
    conn = sqlite3.connect('../banking.db')
    cursor = conn.cursor()
    
    # Test users data
    test_users = [
        {
            'email': 'pranavm2323@gmail.com',
            'password': '.tie5Roanl',  # Store raw password
            'first_name': 'Pranav',
            'last_name': 'M',
            'phone': '9876543210',
        },
        {
            'email': 'priyankaavijay04@gmail.com',
            'password': '.tie5Roanl',  # Store raw password
            'first_name': 'Priyankaa',
            'last_name': 'Vijay',
            'phone': '9876543211',
        }
    ]
    
    for user in test_users:
        try:
            # Delete existing user if present
            cursor.execute('DELETE FROM users WHERE email = ?', (user['email'],))
            
            user_data = {
                'id': str(uuid.uuid4()).replace('-', ''),
                'email': user['email'],
                'password': user['password'],  # Store password directly
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'phone': user['phone'],
                'balance': 100000.0,
                'account_number': str(uuid.uuid4())[:12]
            }
            
            cursor.execute('''
                INSERT INTO users (id, email, password, first_name, last_name,
                    phone, balance, account_number, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ''', (
                user_data['id'], 
                user_data['email'], 
                user_data['password'],  # Raw password
                user_data['first_name'],
                user_data['last_name'],
                user_data['phone'],
                user_data['balance'],
                user_data['account_number']
            ))
            
            print(f"\n=== User Creation Results for {user['email']} ===")
            print("User added successfully!")
            print(f"Email: {user['email']}")
            print(f"Password: {user['password']}")
            print(f"Account Number: {user_data['account_number']}")
            
        except sqlite3.IntegrityError as e:
            print(f"Error adding {user['email']}: {e}")
        except Exception as e:
            print(f"Error adding {user['email']}: {str(e)}")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    add_test_users_dev()