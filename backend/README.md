# Banking Backend

A comprehensive Python Flask backend with SQLite database for the banking application.

## Features

- **User Management**: Registration, login, profile management
- **Stock Trading**: Real-time stock prices, buy/sell functionality
- **Portfolio Management**: Track investments and performance
- **Fixed Deposits**: Create and manage FDs with interest calculations
- **Transaction History**: Complete transaction tracking
- **Fund Transfers**: Secure money transfers
- **Real-time Updates**: Background tasks for stock price updates

## Database Schema

### Tables
- `users`: User accounts and profiles
- `stocks`: Stock market data
- `portfolio`: User stock holdings
- `transactions`: All financial transactions
- `fixed_deposits`: Fixed deposit accounts
- `beneficiaries`: Transfer beneficiaries

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Backend**:
   ```bash
   python app.py
   ```

3. **Access the API**:
   - Base URL: `http://localhost:5000`
   - API Documentation: Available at `/api/` endpoints

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

## Database Initialization

The backend automatically:
- Creates all required tables
- Initializes sample stock data
- Creates a demo user account
- Sets up sample portfolio and transactions

## Security Features

- JWT-based authentication
- Password hashing
- Input validation
- SQL injection protection

## Real-time Features

- Background stock price updates every 30 seconds
- Simulated market movements
- Live portfolio value calculations 