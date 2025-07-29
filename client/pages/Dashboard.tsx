import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  DollarSign,
  TrendingUp,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Send,
  Receipt,
  Smartphone,
  Wifi,
  PiggyBank,
  TrendingDown,
  ArrowRight,
  ArrowLeft,
  CircleDollarSign,
  Banknote,
  Building,
  User,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  userApi,
  portfolioApi,
  transactionsApi,
  Transaction,
  Portfolio,
  PortfolioSummary,
} from "@/services/api";

export function Dashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary>({
    totalValue: 0,
    totalInvestment: 0,
    totalGainLoss: 0,
    totalGainLossPercent: 0,
    holdings: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch portfolio and user profile
        const [portfolioData, profileData, transactionsData] =
          await Promise.all([
            portfolioApi.getPortfolio(),
            userApi.getProfile(),
            transactionsApi.getTransactions("", 10),
          ]);

        if (portfolioData.success) {
          setPortfolio(portfolioData.portfolio || []);
          setPortfolioSummary(
            portfolioData.summary || {
              totalValue: 0,
              totalInvestment: 0,
              totalGainLoss: 0,
              totalGainLossPercent: 0,
              holdings: 0,
            },
          );
        }

        if (transactionsData.success) {
          setRecentTransactions(transactionsData.transactions || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const accounts = user
    ? [
        {
          id: user.accountNumber,
          type: "Savings Account",
          balance: user.balance,
          branch: "OLAVAKKOT",
          nickname: "Primary Savings",
        },
      ]
    : [];

  // Simulated real-time data
  const deposits = [
    {
      id: "DEP001",
      type: "Fixed Deposit",
      amount: 500000,
      interestRate: 7.5,
      maturityDate: "2025-06-15",
      monthsRemaining: 17,
      interestEarned: 45678.9,
      status: "Active",
    },
    {
      id: "DEP002",
      type: "Recurring Deposit",
      amount: 50000,
      monthlyAmount: 5000,
      interestRate: 6.8,
      maturityDate: "2024-12-31",
      monthsRemaining: 11,
      interestEarned: 5234.5,
      status: "Active",
    },
    {
      id: "DEP003",
      type: "Tax Saving FD",
      amount: 150000,
      interestRate: 6.9,
      maturityDate: "2026-03-31",
      monthsRemaining: 26,
      interestEarned: 12450.75,
      status: "Active",
    },
  ];

  const outboundTransfers = [
    {
      id: "TXN240115001",
      recipientName: "Ravi Kumar",
      recipientAccount: "HDFC0001234****5678",
      amount: 25000,
      date: "2024-01-15",
      time: "14:32",
      method: "IMPS",
      status: "Completed",
      reference: "Gift for wedding",
      charges: 5.9,
    },
    {
      id: "TXN240114002",
      recipientName: "Amazon Pay",
      recipientAccount: "AMZN0004321****9876",
      amount: 3500,
      date: "2024-01-14",
      time: "09:45",
      method: "UPI",
      status: "Completed",
      reference: "Online shopping",
      charges: 0,
    },
    {
      id: "TXN240113003",
      recipientName: "Electricity Board",
      recipientAccount: "KSEB0002468****1357",
      amount: 2500,
      date: "2024-01-13",
      time: "16:20",
      method: "NEFT",
      status: "Completed",
      reference: "Bill payment",
      charges: 2.5,
    },
    {
      id: "TXN240112004",
      recipientName: "SBI Credit Card",
      recipientAccount: "SBIN0000123****4567",
      amount: 15000,
      date: "2024-01-12",
      time: "11:15",
      method: "Auto Pay",
      status: "Completed",
      reference: "Credit card payment",
      charges: 0,
    },
  ];

  const inboundTransfers = [
    {
      id: "RXN240115001",
      senderName: "TechCorp Solutions Pvt Ltd",
      senderAccount: "ICIC0001234****8901",
      amount: 85000,
      date: "2024-01-15",
      time: "09:30",
      method: "RTGS",
      status: "Credited",
      reference: "Salary for January 2024",
      purpose: "Salary",
    },
    {
      id: "RXN240114002",
      senderName: "Priya Sharma",
      senderAccount: "AXIS0005678****2345",
      amount: 5000,
      date: "2024-01-14",
      time: "15:45",
      method: "UPI",
      status: "Credited",
      reference: "Birthday gift",
      purpose: "Gift",
    },
    {
      id: "RXN240113003",
      senderName: "Freelance Client",
      senderAccount: "HDFC0009876****5432",
      amount: 12000,
      date: "2024-01-13",
      time: "13:22",
      method: "IMPS",
      status: "Credited",
      reference: "Project completion payment",
      purpose: "Professional Services",
    },
    {
      id: "RXN240112004",
      senderName: "SBI Interest Credit",
      senderAccount: "SBI System Generated",
      amount: 1250,
      date: "2024-01-12",
      time: "02:00",
      method: "Auto Credit",
      status: "Credited",
      reference: "Monthly savings interest",
      purpose: "Interest",
    },
  ];

  const quickServices = [
    {
      name: "New Fixed Deposit",
      icon: PiggyBank,
      color: "text-green-600",
      href: "/fixed-deposits",
    },
    {
      name: "Buy Stocks",
      icon: TrendingUp,
      color: "text-blue-600",
      href: "/investments",
    },
    {
      name: "Fund Transfer",
      icon: Send,
      color: "text-purple-600",
      href: "/transfers",
    },
    {
      name: "Bill Payments",
      icon: Receipt,
      color: "text-orange-600",
      href: "/bills",
    },
  ];

  const investmentPortfolio = [
    {
      symbol: "RELIANCE",
      name: "Reliance Industries Ltd",
      shares: 50,
      buyPrice: 2450.75,
      currentPrice: 2687.9,
      change: +9.67,
      changePercent: +9.67,
      value: 134395,
    },
    {
      symbol: "TCS",
      name: "Tata Consultancy Services",
      shares: 25,
      buyPrice: 3890.25,
      currentPrice: 4125.6,
      change: +6.05,
      changePercent: +6.05,
      value: 103140,
    },
    {
      symbol: "HDFC",
      name: "HDFC Bank Ltd",
      shares: 30,
      buyPrice: 1675.5,
      currentPrice: 1598.75,
      change: -4.58,
      changePercent: -4.58,
      value: 47962.5,
    },
  ];

  const totalPortfolioValue = investmentPortfolio.reduce(
    (sum, stock) => sum + stock.value,
    0,
  );

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Welcome Section */}
      <div className="bg-banking-gradient rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome,{" "}
              {user
                ? `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}`
                : "USER"}
            </h1>
            <p className="text-blue-100 mb-4">
              Last Login:{" "}
              {user?.lastLogin
                ? new Date(user.lastLogin).toLocaleDateString()
                : "N/A"}{" "}
              | {new Date().toLocaleTimeString()}
            </p>
            <p className="text-sm text-blue-100">
              Customer ID: {user?.email || "N/A"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Current Time</p>
            <p className="text-lg font-semibold">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Balance</p>
                <p className="text-2xl font-bold">
                  ₹
                  {showBalance
                    ? (user?.balance || 0).toLocaleString("en-IN")
                    : "****"}
                </p>
              </div>
              <Banknote className="h-8 w-8 text-green-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Fixed Deposits</p>
                <p className="text-2xl font-bold">
                  ₹{showBalance ? (700000).toLocaleString("en-IN") : "****"}
                </p>
              </div>
              <PiggyBank className="h-8 w-8 text-blue-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Stock Portfolio</p>
                <p className="text-2xl font-bold">
                  ₹
                  {showBalance
                    ? portfolioSummary.totalValue.toLocaleString("en-IN")
                    : "****"}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Monthly Income</p>
                <p className="text-2xl font-bold">
                  ₹{showBalance ? (102250).toLocaleString("en-IN") : "****"}
                </p>
              </div>
              <CircleDollarSign className="h-8 w-8 text-orange-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Financial Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deposits Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <PiggyBank className="h-5 w-5 mr-2 text-green-600" />
              Fixed Deposits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deposits.map((deposit) => (
                <div
                  key={deposit.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {deposit.type}
                      </h4>
                      <p className="text-sm text-gray-600">ID: {deposit.id}</p>
                    </div>
                    <Badge variant="secondary">{deposit.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <p className="font-semibold">
                        ₹{deposit.amount.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Interest:</span>
                      <p className="font-semibold text-green-600">
                        {deposit.interestRate}%
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Maturity:</span>
                      <p className="font-semibold">{deposit.maturityDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Earned:</span>
                      <p className="font-semibold text-green-600">
                        ₹{deposit.interestEarned.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <PiggyBank className="h-4 w-4 mr-2" />
                New Fixed Deposit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transfers Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <ArrowRightLeft className="h-5 w-5 mr-2 text-blue-600" />
              Transfer Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="outbound" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="outbound" className="text-xs">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Outbound
                </TabsTrigger>
                <TabsTrigger value="inbound" className="text-xs">
                  <ArrowDownLeft className="h-3 w-3 mr-1" />
                  Inbound
                </TabsTrigger>
              </TabsList>

              <TabsContent value="outbound" className="space-y-3 mt-4">
                {outboundTransfers.slice(0, 3).map((transfer) => (
                  <div
                    key={transfer.id}
                    className="border rounded-lg p-3 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {transfer.recipientName}
                        </p>
                        <p className="text-xs text-gray-600">{transfer.id}</p>
                      </div>
                      <Badge
                        variant="default"
                        className="text-xs bg-red-100 text-red-800"
                      >
                        -₹{transfer.amount.toLocaleString("en-IN")}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>
                        {transfer.date} • {transfer.time}
                      </p>
                      <p>
                        {transfer.method} • {transfer.reference}
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full text-xs">
                  View All Outbound
                </Button>
              </TabsContent>

              <TabsContent value="inbound" className="space-y-3 mt-4">
                {inboundTransfers.slice(0, 3).map((transfer) => (
                  <div
                    key={transfer.id}
                    className="border rounded-lg p-3 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {transfer.senderName}
                        </p>
                        <p className="text-xs text-gray-600">{transfer.id}</p>
                      </div>
                      <Badge
                        variant="default"
                        className="text-xs bg-green-100 text-green-800"
                      >
                        +₹{transfer.amount.toLocaleString("en-IN")}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>
                        {transfer.date} • {transfer.time}
                      </p>
                      <p>
                        {transfer.method} • {transfer.purpose}
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full text-xs">
                  View All Inbound
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Money Received / Investment Portfolio */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
              Investment Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Portfolio Value</p>
                <p className="text-lg font-bold text-purple-600">
                  ₹{totalPortfolioValue.toLocaleString("en-IN")}
                </p>
              </div>

              {investmentPortfolio.map((stock) => (
                <div
                  key={stock.symbol}
                  className="border rounded-lg p-3 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {stock.symbol}
                      </p>
                      <p className="text-xs text-gray-600">
                        {stock.shares} shares
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        ₹{stock.currentPrice}
                      </p>
                      <Badge
                        variant={stock.change > 0 ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {stock.change > 0 ? "+" : ""}
                        {stock.changePercent}%
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    <p>Value: ₹{stock.value.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Full Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Quick Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex-col space-y-2 hover:bg-gray-50"
                >
                  <Icon className={`h-6 w-6 ${service.color}`} />
                  <span className="text-xs text-center">{service.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Transaction History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Recent Transaction Details
          </CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="outbound">Sent Money</TabsTrigger>
              <TabsTrigger value="inbound">Received Money</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium">
                        Transaction ID
                      </th>
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-left py-3 px-4 font-medium">Party</th>
                      <th className="text-right py-3 px-4 font-medium">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Date & Time
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ...inboundTransfers.map((t) => ({
                        ...t,
                        type: "inbound",
                      })),
                      ...outboundTransfers.map((t) => ({
                        ...t,
                        type: "outbound",
                      })),
                    ]
                      .sort(
                        (a, b) =>
                          new Date(b.date + " " + b.time).getTime() -
                          new Date(a.date + " " + a.time).getTime(),
                      )
                      .slice(0, 8)
                      .map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 font-mono text-xs">
                            {transaction.id}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                transaction.type === "inbound"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {transaction.type === "inbound" ? (
                                <ArrowDownLeft className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                              )}
                              {transaction.type === "inbound"
                                ? "Received"
                                : "Sent"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-medium">
                              {transaction.type === "inbound"
                                ? transaction.senderName
                                : transaction.recipientName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {transaction.method}
                            </p>
                          </td>
                          <td
                            className={`py-3 px-4 text-right font-semibold ${
                              transaction.type === "inbound"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.type === "inbound" ? "+" : "-"}₹
                            {transaction.amount.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-4">
                            <p>{transaction.date}</p>
                            <p className="text-xs text-gray-500">
                              {transaction.time}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="default"
                              className="bg-green-100 text-green-800"
                            >
                              {transaction.status || "Completed"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
