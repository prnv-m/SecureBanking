# Banking Application Setup Guide

This guide will help you set up the complete banking application with the new Python+SQLite backend.

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

## Backend Setup

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the Backend Server

```bash
# From the root directory
python start_backend.py

# Or from the backend directory
cd backend
python app.py
```

The backend will be available at `http://localhost:5000`

## Frontend Setup

### 1. Install Node.js Dependencies

```bash
npm install
```

### 2. Start the Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Complete Setup Script

You can run this one-time setup script:

```bash
# Install backend dependencies
npm run install-backend

# Install frontend dependencies
npm install

# Start backend (in one terminal)
npm run start-backend

# Start frontend (in another terminal)
npm run dev
```

## Database Features

The new backend includes a comprehensive SQLite database with:

### Tables
- **users**: User accounts and profiles
- **stocks**: Real-time stock market data
- **portfolio**: User stock holdings and investments
- **transactions**: Complete transaction history
- **fixed_deposits**: Fixed deposit accounts
- **beneficiaries**: Transfer beneficiaries

### Sample Data
The backend automatically initializes with:
- Demo user account (email: pranav1233@gmail.com, password: demo123)
- 10 popular Indian stocks with real-time price updates
- Sample portfolio holdings
- Sample transactions
- Sample fixed deposits

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Stocks
- `GET /api/stocks` - Get all stocks
- `GET /api/stocks/<symbol>` - Get specific stock
- `POST /api/stocks/buy` - Buy stocks
- `POST /api/stocks/sell` - Sell stocks

### Portfolio
- `GET /api/portfolio` - Get user portfolio

### Transactions
- `GET /api/transactions` - Get transaction history

### Fixed Deposits
- `GET /api/fixed-deposits` - Get user FDs
- `POST /api/fixed-deposits` - Create new FD

### Transfers
- `POST /api/transfers` - Create money transfer

## Features

### Real-time Updates
- Stock prices update every 30 seconds
- Portfolio values calculated in real-time
- Live transaction tracking

### Security
- JWT-based authentication
- Password hashing
- Input validation
- SQL injection protection

### Banking Features
- **User Management**: Complete user registration and profile management
- **Stock Trading**: Real-time stock prices with buy/sell functionality
- **Portfolio Management**: Track investments with gain/loss calculations
- **Fixed Deposits**: Create FDs with interest rate calculations
- **Fund Transfers**: Secure money transfers between accounts
- **Transaction History**: Complete audit trail of all financial activities

## Demo Account

Use these credentials to test the application:
- **Email**: pranav1233@gmail.com
- **Password**: demo123

## Troubleshooting

### Backend Issues
1. Make sure Python 3.8+ is installed
2. Check if all dependencies are installed: `pip install -r requirements.txt`
3. Ensure port 5000 is available
4. Check the console for any error messages

### Frontend Issues
1. Make sure Node.js 16+ is installed
2. Run `npm install` to install dependencies
3. Ensure the backend is running before starting the frontend
4. Check browser console for any API errors

### Database Issues
The database file (`banking.db`) will be created automatically when you first run the backend. If you need to reset the database, simply delete the `banking.db` file and restart the backend.

## Development

### Backend Development
- The backend is built with Flask and SQLite
- All data is stored in the `banking.db` file
- Real-time stock updates are simulated with background tasks
- JWT tokens are used for authentication

### Frontend Development
- Built with React, TypeScript, and Vite
- Uses shadcn/ui components
- Tailwind CSS for styling
- React Router for navigation

## Production Deployment

For production deployment:
1. Change the JWT secret key in `backend/app.py`
2. Use a production database (PostgreSQL, MySQL)
3. Set up proper CORS configuration
4. Use environment variables for sensitive data
5. Set up proper logging and monitoring 