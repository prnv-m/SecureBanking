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
  Transaction,
  Portfolio,
  PortfolioSummary,
} from "@/services/api";
import { transfersApi } from "@/services/transfersapi";
import { useNavigate } from "react-router-dom";

// Define the interface for a Fixed Deposit based on your API response
export interface FixedDeposit {
  id: string;
  amount: number;
  interestRate: number;
  tenure: number;
  startDate: string;
  maturityDate: string;
  type: string;
  status: string;
  interestEarned: number;
  maturityAmount: number;
}

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
  const [fixedDeposits, setFixedDeposits] = useState<FixedDeposit[]>([]);
  const [transferHistory, setTransferHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [profileData, transfersData] = await Promise.all([
          userApi.getProfile(),
          transfersApi.getRecentTransfers()
        ]);

        if (profileData.success) {
          setPortfolio(profileData.portfolio || []);
          setPortfolioSummary(
            profileData.portfolioSummary || {
              totalValue: 0,
              totalInvestment: 0,
              totalGainLoss: 0,
              totalGainLossPercent: 0,
              holdings: 0,
            },
          );
          setRecentTransactions(profileData.recentTransactions || []);
          setFixedDeposits(profileData.fixedDeposits || []);
        }

        if (transfersData.success) {
          setTransferHistory(transfersData.transfers || []);
        } else {
          console.warn('Failed to load transfer data:', transfersData);
          setTransferHistory([]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Ensure states are initialized even on error
        setTransferHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Process transfer data to separate inbound and outbound (with safety check)
  const safeTransferHistory = Array.isArray(transferHistory) ? transferHistory : [];
  const outboundTransfers = safeTransferHistory
    .filter(transfer => transfer.type === 'TRANSFER_OUT' && transfer.amount < 0)
    .map(transfer => {
      let date, time;
      try {
        const dateObj = transfer.created_at ? new Date(transfer.created_at) : new Date();
        if (isNaN(dateObj.getTime())) {
          // Fallback to current date if invalid
          const fallbackDate = new Date();
          date = fallbackDate.toISOString().split('T')[0];
          time = fallbackDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        } else {
          date = dateObj.toISOString().split('T')[0];
          time = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        }
      } catch (error) {
        console.error('Date parsing error:', error);
        const fallbackDate = new Date();
        date = fallbackDate.toISOString().split('T')[0];
        time = fallbackDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      }
      
      return {
        id: transfer.id || 'N/A',
        recipientName: transfer.counterparty || 'Unknown Recipient',
        amount: Math.abs(transfer.amount || 0),
        date,
        time,
        method: 'IMPS',
        reference: transfer.reference || transfer.description || 'Transfer',
      };
    });

  const inboundTransfers = safeTransferHistory
    .filter(transfer => transfer.type === 'TRANSFER_IN' || (transfer.type === 'TRANSFER_OUT' && transfer.amount > 0))
    .map(transfer => {
      let date, time;
      try {
        const dateObj = transfer.created_at ? new Date(transfer.created_at) : new Date();
        if (isNaN(dateObj.getTime())) {
          // Fallback to current date if invalid
          const fallbackDate = new Date();
          date = fallbackDate.toISOString().split('T')[0];
          time = fallbackDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        } else {
          date = dateObj.toISOString().split('T')[0];
          time = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        }
      } catch (error) {
        console.error('Date parsing error:', error);
        const fallbackDate = new Date();
        date = fallbackDate.toISOString().split('T')[0];
        time = fallbackDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      }
      
      return {
        id: transfer.id || 'N/A',
        senderName: transfer.counterparty || 'Internal Transfer',
        amount: Math.abs(transfer.amount || 0),
        date,
        time,
        method: 'IMPS',
        purpose: transfer.reference || transfer.description || 'Transfer',
      };
    });

  const quickServices = [
    { name: "New Fixed Deposit", icon: PiggyBank, color: "text-green-600", href: "/fixed-deposits" },
    { name: "Buy Stocks", icon: TrendingUp, color: "text-blue-600", href: "/investments" },
    { name: "Fund Transfer", icon: Send, color: "text-purple-600", href: "/transfers" },
    { name: "Bill Payments", icon: Receipt, color: "text-orange-600", href: "/bills" },
  ];

  // --- CALCULATED VALUES ---

  // Calculate total FD value from the fetched data
  const totalFDValue = fixedDeposits
    .filter((fd) => fd.status === "ACTIVE")
    .reduce((sum, fd) => sum + fd.amount, 0);
  
  // NEW: Calculate the user's total assets (Savings Balance + Stocks Value + FD Value)
  const totalAssets =
    (user?.balance || 0) + portfolioSummary.totalValue + totalFDValue;


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
        
        {/* --- MODIFICATION START --- */}
        {/* This card now displays the calculated total assets */}
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                {/* Changed title for better clarity */}
                <p className="text-green-100 text-sm">Total Assets</p>
                <p className="text-2xl font-bold">
                  ₹
                  {showBalance
                    // Using the new totalAssets variable for display
                    ? totalAssets.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
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
                  ₹
                  {showBalance
                    ? totalFDValue.toLocaleString("en-IN")
                    : "****"}
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
        {/* Liquid Savings Card (Directly from user.balance) */}
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Liquid Savings</p>
                <p className="text-2xl font-bold">
                  {/* This now displays the user's actual, current balance from the context */}
                  ₹{showBalance ? user.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "****"}
                </p>
              </div>
              <CircleDollarSign className="h-8 w-8 text-orange-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Financial Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deposits Section - NOW USES LIVE DATA */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <PiggyBank className="h-5 w-5 mr-2 text-green-600" />
              Fixed Deposits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <p>Loading deposits...</p>
              ) : (
                fixedDeposits.map((deposit) => (
                  <div
                    key={deposit.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {deposit.type.replace("_", " ")} Deposit
                        </h4>
                        <p className="text-sm text-gray-600">
                          ID: ...{deposit.id.slice(-6)}
                        </p>
                      </div>
                      <Badge variant={deposit.status === 'ACTIVE' ? "default" : "secondary"}>{deposit.status}</Badge>
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
                        <p className="font-semibold">
                          {new Date(deposit.maturityDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Earned:</span>
                        <p className="font-semibold text-green-600">
                          ₹{deposit.interestEarned.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
                {outboundTransfers.length > 0 ? (
                  <>
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
                            <p className="text-xs text-gray-600">...{transfer.id.slice(-8)}</p>
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
                  </>
                ) : (
                  <p className="text-center text-gray-500 py-4 text-sm">No outbound transfers yet</p>
                )}
              </TabsContent>

              <TabsContent value="inbound" className="space-y-3 mt-4">
                {inboundTransfers.length > 0 ? (
                  <>
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
                            <p className="text-xs text-gray-600">...{transfer.id.slice(-8)}</p>
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
                  </>
                ) : (
                  <p className="text-center text-gray-500 py-4 text-sm">No inbound transfers yet</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Investment Portfolio - NOW USES LIVE DATA */}
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
                  ₹{portfolioSummary.totalValue.toLocaleString("en-IN")}
                </p>
              </div>

              {isLoading ? (
                <p>Loading portfolio...</p>
              ) : (
                portfolio.map((stock) => (
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
                          ₹{stock.currentPrice.toFixed(2)}
                        </p>
                        <Badge
                          variant={
                            stock.gainLossPercent >= 0 ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {stock.gainLossPercent >= 0 ? "+" : ""}
                          {stock.gainLossPercent.toFixed(2)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>
                        Value: ₹{stock.currentValue.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}

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
                  onClick={() => navigate(service.href)}
                >
                  <Icon className={`h-6 w-6 ${service.color}`} />
                  <span className="text-xs text-center">{service.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}