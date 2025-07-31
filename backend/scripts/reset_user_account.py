#!/usr/bin/env python3
"""
Account Reset Script for SecureBanking Application

This script resets a user's account to its default state:
- Clears all transactions
- Resets balance to 100,000 (1 lakh)
- Removes all investments (stocks, FDs)
- Clears all billers and auto-pay rules
- Removes all beneficiaries
- Clears all tax payments
- Preserves user account and authentication data

Usage:
    python reset_user_account.py <email>
    
Example:
    python reset_user_account.py user@example.com
"""

import sys
import sqlite3
import os
from datetime import datetime

# Add parent directory to path to import from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

DATABASE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'banking.db')
DEFAULT_BALANCE = 100000.0  # 1 lakh

def get_user_by_email(email):
    """Get user information by email"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    
    return user

def reset_user_account(email):
    """Reset user account to default state"""
    print(f"Starting account reset for email: {email}")
    
    # First, check if user exists
    user = get_user_by_email(email)
    if not user:
        print(f"❌ Error: User with email '{email}' not found.")
        return False
    
    user_id = user['id']
    print(f"✓ Found user: {user['first_name']} {user['last_name']} (ID: {user_id})")
    
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    try:
        print("\n🧹 Clearing user data...")
        
        # 1. Delete all transactions
        cursor.execute("SELECT COUNT(*) FROM transactions WHERE user_id = ?", (user_id,))
        transaction_count = cursor.fetchone()[0]
        cursor.execute("DELETE FROM transactions WHERE user_id = ?", (user_id,))
        print(f"✓ Deleted {transaction_count} transactions")
        
        # 2. Delete all stock investments (portfolio)
        cursor.execute("SELECT COUNT(*) FROM portfolio WHERE user_id = ?", (user_id,))
        stock_count = cursor.fetchone()[0]
        cursor.execute("DELETE FROM portfolio WHERE user_id = ?", (user_id,))
        print(f"✓ Deleted {stock_count} stock investments")
        
        # 3. Delete all fixed deposits
        cursor.execute("SELECT COUNT(*) FROM fixed_deposits WHERE user_id = ?", (user_id,))
        fd_count = cursor.fetchone()[0]
        cursor.execute("DELETE FROM fixed_deposits WHERE user_id = ?", (user_id,))
        print(f"✓ Deleted {fd_count} fixed deposits")
        
        # 4. Delete all billers
        cursor.execute("SELECT COUNT(*) FROM billers WHERE user_id = ?", (user_id,))
        biller_count = cursor.fetchone()[0]
        cursor.execute("DELETE FROM billers WHERE user_id = ?", (user_id,))
        print(f"✓ Deleted {biller_count} registered billers")
        
        # 5. Delete all auto-pay rules
        cursor.execute("SELECT COUNT(*) FROM autopay_rules WHERE user_id = ?", (user_id,))
        autopay_count = cursor.fetchone()[0]
        cursor.execute("DELETE FROM autopay_rules WHERE user_id = ?", (user_id,))
        print(f"✓ Deleted {autopay_count} auto-pay rules")
        
        # 6. Delete all beneficiaries
        cursor.execute("SELECT COUNT(*) FROM beneficiaries WHERE user_id = ?", (user_id,))
        beneficiary_count = cursor.fetchone()[0]
        cursor.execute("DELETE FROM beneficiaries WHERE user_id = ?", (user_id,))
        print(f"✓ Deleted {beneficiary_count} beneficiaries")
        
        # 7. Delete all tax payments
        cursor.execute("SELECT COUNT(*) FROM tax_payments WHERE user_id = ?", (user_id,))
        tax_count = cursor.fetchone()[0]
        cursor.execute("DELETE FROM tax_payments WHERE user_id = ?", (user_id,))
        print(f"✓ Deleted {tax_count} tax payments")
        
        # 8. Delete all bills
        cursor.execute("SELECT COUNT(*) FROM bills WHERE user_id = ?", (user_id,))
        bills_count = cursor.fetchone()[0]
        cursor.execute("DELETE FROM bills WHERE user_id = ?", (user_id,))
        print(f"✓ Deleted {bills_count} bills")
        
        # 9. Delete all bill payments
        cursor.execute("SELECT COUNT(*) FROM bill_payments WHERE user_id = ?", (user_id,))
        bill_payments_count = cursor.fetchone()[0]
        cursor.execute("DELETE FROM bill_payments WHERE user_id = ?", (user_id,))
        print(f"✓ Deleted {bill_payments_count} bill payments")
        
        # 10. Delete all user registered bills
        cursor.execute("SELECT COUNT(*) FROM user_registered_bills WHERE user_id = ?", (user_id,))
        registered_bills_count = cursor.fetchone()[0]
        cursor.execute("DELETE FROM user_registered_bills WHERE user_id = ?", (user_id,))
        print(f"✓ Deleted {registered_bills_count} registered bills")
        
        # 11. Delete all user events (optional - for privacy)
        cursor.execute("SELECT COUNT(*) FROM user_events WHERE user_email = ?", (email,))
        events_count = cursor.fetchone()[0]
        cursor.execute("DELETE FROM user_events WHERE user_email = ?", (email,))
        print(f"✓ Deleted {events_count} user events")
        
        # 12. Reset user balance to default
        old_balance = user['balance']
        cursor.execute("UPDATE users SET balance = ? WHERE id = ?", (DEFAULT_BALANCE, user_id))
        print(f"✓ Reset balance from ₹{old_balance:,.2f} to ₹{DEFAULT_BALANCE:,.2f}")
        
        # 13. Update last_login to current time (optional)
        cursor.execute("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?", (user_id,))
        print("✓ Updated last login timestamp")
        
        # Commit all changes
        conn.commit()
        print(f"\n✅ Account reset completed successfully for {email}")
        print(f"📊 Summary:")
        print(f"   • Transactions cleared: {transaction_count}")
        print(f"   • Stock investments cleared: {stock_count}")
        print(f"   • Fixed deposits cleared: {fd_count}")
        print(f"   • Billers cleared: {biller_count}")
        print(f"   • Auto-pay rules cleared: {autopay_count}")
        print(f"   • Beneficiaries cleared: {beneficiary_count}")
        print(f"   • Tax payments cleared: {tax_count}")
        print(f"   • Bills cleared: {bills_count}")
        print(f"   • Bill payments cleared: {bill_payments_count}")
        print(f"   • Registered bills cleared: {registered_bills_count}")
        print(f"   • User events cleared: {events_count}")
        print(f"   • Balance reset to: ₹{DEFAULT_BALANCE:,.2f}")
        
        return True
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Error during reset: {str(e)}")
        return False
        
    finally:
        conn.close()

def verify_reset(email):
    """Verify that the reset was successful"""
    print(f"\n🔍 Verifying reset for {email}...")
    
    user = get_user_by_email(email)
    if not user:
        print("❌ User not found during verification")
        return False
    
    user_id = user['id']
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Check all tables are empty for this user
    tables_to_check = [
        'transactions',
        'portfolio', 
        'fixed_deposits',
        'billers',
        'autopay_rules', 
        'beneficiaries',
        'tax_payments',
        'bills',
        'bill_payments',
        'user_registered_bills'
    ]
    
    # Also check user_events table (uses email instead of user_id)
    cursor.execute("SELECT COUNT(*) FROM user_events WHERE user_email = ?", (email,))
    events_count = cursor.fetchone()[0]
    if events_count > 0:
        print(f"⚠️  Warning: user_events still has {events_count} records")
        all_clear = False
    else:
        print(f"✓ user_events: cleared")
    
    all_clear = True
    for table in tables_to_check:
        cursor.execute(f"SELECT COUNT(*) FROM {table} WHERE user_id = ?", (user_id,))
        count = cursor.fetchone()[0]
        if count > 0:
            print(f"⚠️  Warning: {table} still has {count} records")
            all_clear = False
        else:
            print(f"✓ {table}: cleared")
    
    # Check balance
    if user['balance'] == DEFAULT_BALANCE:
        print(f"✓ Balance: ₹{user['balance']:,.2f} (correct)")
    else:
        print(f"⚠️  Balance: ₹{user['balance']:,.2f} (expected ₹{DEFAULT_BALANCE:,.2f})")
        all_clear = False
    
    conn.close()
    
    if all_clear:
        print("✅ Verification passed - account successfully reset")
    else:
        print("❌ Verification failed - some data may not have been cleared")
    
    return all_clear

def main():
    if len(sys.argv) != 2:
        print("Usage: python reset_user_account.py <email>")
        print("Example: python reset_user_account.py user@example.com")
        sys.exit(1)
    
    email = sys.argv[1].strip().lower()
    
    if not email or '@' not in email:
        print("❌ Error: Please provide a valid email address")
        sys.exit(1)
    
    print("=" * 60)
    print("SecureBanking Account Reset Script")
    print("=" * 60)
    print(f"Target email: {email}")
    print(f"Database: {DATABASE}")
    print(f"Reset date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # Confirm before proceeding
    response = input(f"\n⚠️  WARNING: This will permanently delete ALL banking activity for '{email}'.\nAre you sure you want to continue? (type 'YES' to confirm): ")
    
    if response != 'YES':
        print("❌ Operation cancelled by user")
        sys.exit(0)
    
    # Check if database exists
    if not os.path.exists(DATABASE):
        print(f"❌ Error: Database file not found at {DATABASE}")
        sys.exit(1)
    
    # Perform reset
    success = reset_user_account(email)
    
    if success:
        # Verify reset
        verify_reset(email)
        print(f"\n🎉 Account reset completed for {email}")
    else:
        print(f"\n❌ Account reset failed for {email}")
        sys.exit(1)

if __name__ == "__main__":
    main()