import requests
import json

def test_login():
    # Test credentials
    login_data = {
        "email": "priyankaavijay@gmail.com",
        "password": ".tie5Roanl"
    }

    try:
        # Test basic login first (without biometrics)
        response = requests.post(
            'http://localhost:5000/api/auth/login',
            json=login_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print("\n=== Basic Login Test ===")
        print(f"Status Code: {response.status_code}")
        print("Response Headers:", json.dumps(dict(response.headers), indent=2))
        print("Response Body:", json.dumps(response.json(), indent=2))

        # Check if user exists in database directly
        print("\n=== Database Check ===")
        import sqlite3
        conn = sqlite3.connect('../banking.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, email, first_name, last_name, account_number 
            FROM users 
            WHERE email = ?
        ''', (login_data["email"],))
        
        user = cursor.fetchone()
        if user:
            print("User found in database:")
            print(f"ID: {user[0]}")
            print(f"Email: {user[1]}")
            print(f"Name: {user[2]} {user[3]}")
            print(f"Account: {user[4]}")
        else:
            print("User not found in database!")
        
        conn.close()

    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to server. Is Flask running?")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_login()