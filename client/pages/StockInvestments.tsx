import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { stocksApi, portfolioApi, Stock, Portfolio } from "@/services/api";
import { StockTrading } from "@/components/StockTrading";
import { BankingLayout } from "@/components/layout/BankingLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Plus,
  Eye,
  Download,
  RefreshCw,
  DollarSign,
  BarChart3,
  Activity,
  Target,
  AlertTriangle,
  ShoppingCart,
  Wallet,
  PieChart,
  LineChart,
  Loader2,
} from "lucide-react";

export default function StockInvestments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [buyQuantity, setBuyQuantity] = useState("");
  const [selectedStockSymbol, setSelectedStockSymbol] = useState("");
  const [sellQuantity, setSellQuantity] = useState("");
  const [selectedSellStockSymbol, setSelectedSellStockSymbol] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [stocksData, portfolioData] = await Promise.all([
          stocksApi.getAllStocks(),
          portfolioApi.getPortfolio(),
        ]);

        if ((stocksData as any).success) {
          setStocks((stocksData as any).stocks || []);
        }

        if ((portfolioData as any).success) {
          setPortfolio((portfolioData as any).portfolio || []);
          setPortfolioValue((portfolioData as any).summary?.totalValue || 0);
          setTotalInvestment((portfolioData as any).summary?.totalInvestment || 0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load stock data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, toast]);

  // Refresh data after transactions
  const handleTransactionComplete = async () => {
    try {
      const [portfolioData] = await Promise.all([portfolioApi.getPortfolio()]);

      if ((portfolioData as any).success) {
        setPortfolio((portfolioData as any).portfolio || []);
        setPortfolioValue((portfolioData as any).summary?.totalValue || 0);
        setTotalInvestment((portfolioData as any).summary?.totalInvestment || 0);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const handleBuyStock = async () => {
    if (!selectedStockSymbol || !buyQuantity || parseInt(buyQuantity) <= 0) {
      toast({
        title: "Error",
        description: "Please select a stock and enter a valid quantity",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await stocksApi.buyStock(selectedStockSymbol, parseInt(buyQuantity));

      if ((result as any).success) {
        toast({
          title: "Success",
          description: `Successfully bought ${buyQuantity} shares of ${selectedStockSymbol}`,
        });
        
        // Reset form
        setSelectedStockSymbol("");
        setBuyQuantity("");
        
        // Refresh portfolio
        await handleTransactionComplete();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to buy stock",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSellStock = async () => {
    if (!selectedSellStockSymbol || !sellQuantity || parseInt(sellQuantity) <= 0) {
      toast({
        title: "Error",
        description: "Please select a stock and enter a valid quantity",
        variant: "destructive",
      });
      return;
    }

    // Check if user has enough shares to sell
    const portfolioStock = portfolio.find(p => p.symbol === selectedSellStockSymbol);
    if (!portfolioStock) {
      toast({
        title: "Error",
        description: "You don't own any shares of this stock",
        variant: "destructive",
      });
      return;
    }

    if (parseInt(sellQuantity) > portfolioStock.shares) {
      toast({
        title: "Error",
        description: `You only own ${portfolioStock.shares} shares of ${selectedSellStockSymbol}. Cannot sell ${sellQuantity} shares.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await stocksApi.sellStock(selectedSellStockSymbol, parseInt(sellQuantity));

      if ((result as any).success) {
        toast({
          title: "Success",
          description: `Successfully sold ${sellQuantity} shares of ${selectedSellStockSymbol}`,
        });
        
        // Reset form
        setSelectedSellStockSymbol("");
        setSellQuantity("");
        
        // Refresh portfolio
        await handleTransactionComplete();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sell stock",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalGainLoss = portfolioValue - totalInvestment;
  const totalGainLossPercent =
    totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const topGainers = stocks
    .filter((stock) => stock.changePercent > 0)
    .slice(0, 5);
  const topLosers = stocks
    .filter((stock) => stock.changePercent < 0)
    .slice(0, 5);

  if (isLoading) {
    return (
      <BankingLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading stock data...</span>
        </div>
      </BankingLayout>
    );
  }

  return (
    <BankingLayout>
      <div className="space-y-6 animate-slide-in">
        {/* Header */}
        <div className="bg-banking-gradient rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 mr-4" />
              <div>
                <h1 className="text-2xl font-bold">Stock Investments</h1>
                <p className="text-blue-100">Trade smart, invest smarter</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Portfolio Value</p>
              <p className="text-2xl font-bold">
                ₹{portfolioValue.toLocaleString("en-IN")}
              </p>
              <p
                className={`text-sm ${totalGainLoss >= 0 ? "text-green-200" : "text-red-200"}`}
              >
                {totalGainLoss >= 0 ? "+" : ""}₹
                {totalGainLoss.toLocaleString("en-IN")} (
                {totalGainLossPercent.toFixed(2)}%)
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Investment</p>
                  <p className="text-2xl font-bold">
                    ₹{totalInvestment.toLocaleString("en-IN")}
                  </p>
                </div>
                <Wallet className="h-8 w-8 text-green-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Current Value</p>
                  <p className="text-2xl font-bold">
                    ₹{portfolioValue.toLocaleString("en-IN")}
                  </p>
                </div>
                <PieChart className="h-8 w-8 text-blue-100" />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`bg-gradient-to-r ${totalGainLoss >= 0 ? "from-purple-500 to-purple-600" : "from-red-500 to-red-600"} text-white`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`${totalGainLoss >= 0 ? "text-purple-100" : "text-red-100"} text-sm`}
                  >
                    Total P&L
                  </p>
                  <p className="text-2xl font-bold">
                    {totalGainLoss >= 0 ? "+" : ""}₹
                    {totalGainLoss.toLocaleString("en-IN")}
                  </p>
                </div>
                {totalGainLoss >= 0 ? (
                  <TrendingUp className="h-8 w-8 text-purple-100" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-100" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Holdings</p>
                  <p className="text-2xl font-bold">{portfolio.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-100" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Holdings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-purple-600" />
                  My Portfolio
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolio.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No stocks in your portfolio yet.</p>
                    <p className="text-sm">Start trading to build your portfolio!</p>
                  </div>
                ) : (
                  portfolio.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {stock.symbol}
                          </h3>
                          <p className="text-sm text-gray-600">{(stock as any).name}</p>
                          <p className="text-xs text-gray-500">
                            {stock.shares} shares
                          </p>
                        </div>
                        <Badge
                          variant={
                            stock.gainLoss >= 0 ? "default" : "destructive"
                          }
                        >
                          {stock.gainLoss >= 0 ? "+" : ""}₹
                          {stock.gainLoss.toLocaleString("en-IN")}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Buy Price:</span>
                          <p className="font-semibold">₹{stock.buyPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Current Price:</span>
                          <p className="font-semibold">₹{stock.currentPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Investment:</span>
                          <p className="font-semibold">
                            ₹{stock.totalInvestment.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Current Value:</span>
                          <p className="font-semibold">
                            ₹{stock.currentValue.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <div
                          className={`text-sm font-semibold ${stock.gainLossPercent >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {stock.gainLossPercent >= 0 ? "+" : ""}
                          {stock.gainLossPercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Market Movers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Market Movers
                <Button variant="ghost" size="sm" className="ml-auto">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="gainers" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="gainers" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Gainers
                  </TabsTrigger>
                  <TabsTrigger value="losers" className="text-xs">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Losers
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="gainers" className="space-y-3 mt-4">
                  {topGainers.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="flex justify-between items-center p-2 border rounded hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium text-sm">{stock.symbol}</p>
                        <p className="text-xs text-gray-600">
                          ₹{stock.price.toFixed(2)}
                        </p>
                      </div>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 text-xs"
                      >
                        +{stock.changePercent.toFixed(2)}%
                      </Badge>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="losers" className="space-y-3 mt-4">
                  {topLosers.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="flex justify-between items-center p-2 border rounded hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium text-sm">{stock.symbol}</p>
                        <p className="text-xs text-gray-600">
                          ₹{stock.price.toFixed(2)}
                        </p>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {stock.changePercent.toFixed(2)}%
                      </Badge>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Stock Search and Trading */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Search className="h-5 w-5 mr-2 text-green-600" />
              Stock Market
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search stocks by symbol or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium">Symbol</th>
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-right py-3 px-4 font-medium">Price</th>
                    <th className="text-right py-3 px-4 font-medium">Change</th>
                    <th className="text-right py-3 px-4 font-medium">Volume</th>
                    <th className="text-right py-3 px-4 font-medium">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.slice(0, 10).map((stock) => (
                    <tr
                      key={stock.symbol}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium">{stock.symbol}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{stock.name}</p>
                          <p className="text-xs text-gray-500">
                            {stock.category}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        ₹{stock.price.toFixed(2)}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-semibold ${
                          stock.change >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stock.change >= 0 ? "+" : ""}₹{stock.change.toFixed(2)}
                        <br />
                        <span className="text-xs">
                          ({stock.changePercent >= 0 ? "+" : ""}
                          {stock.changePercent.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-xs text-gray-600">
                        {stock.volume}
                      </td>
                      <td className="py-3 px-4 text-right text-xs text-gray-600">
                        {stock.category}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Trading Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Plus className="h-5 w-5 mr-2 text-green-600" />
                Quick Buy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="stock-select">Select Stock</Label>
                  <Input
                    id="stock-select"
                    placeholder="Enter stock symbol (e.g., RELIANCE)"
                    value={selectedStockSymbol}
                    onChange={(e) => setSelectedStockSymbol(e.target.value.toUpperCase())}
                  />
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Number of shares"
                    value={buyQuantity}
                    onChange={(e) => setBuyQuantity(e.target.value)}
                  />
                </div>

                {selectedStockSymbol && buyQuantity && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <Target className="h-3 w-3 inline mr-1" />
                      Estimated Cost: ₹{(parseFloat(buyQuantity) || 0) * (stocks.find(s => s.symbol === selectedStockSymbol)?.price || 0)}
                    </p>
                  </div>
                )}

                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleBuyStock}
                  disabled={isLoading || !selectedStockSymbol || !buyQuantity}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-4 w-4 mr-2" />
                  )}
                  Place Buy Order
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-red-600" />
                Quick Sell
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sell-stock-select">Select Stock</Label>
                  <Input
                    id="sell-stock-select"
                    placeholder="Enter stock symbol (e.g., RELIANCE)"
                    value={selectedSellStockSymbol}
                    onChange={(e) => setSelectedSellStockSymbol(e.target.value.toUpperCase())}
                  />
                </div>

                <div>
                  <Label htmlFor="sell-quantity">Quantity</Label>
                  <Input
                    id="sell-quantity"
                    type="number"
                    placeholder="Number of shares"
                    value={sellQuantity}
                    onChange={(e) => setSellQuantity(e.target.value)}
                  />
                </div>

                {selectedSellStockSymbol && sellQuantity && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-700">
                      <Target className="h-3 w-3 inline mr-1" />
                      Estimated Proceeds: ₹{(parseFloat(sellQuantity) || 0) * (stocks.find(s => s.symbol === selectedSellStockSymbol)?.price || 0)}
                    </p>
                    {(() => {
                      const portfolioStock = portfolio.find(p => p.symbol === selectedSellStockSymbol);
                      if (portfolioStock) {
                        return (
                          <p className="text-xs text-red-600 mt-1">
                            You own {portfolioStock.shares} shares of {selectedSellStockSymbol}
                          </p>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}

                <Button 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={handleSellStock}
                  disabled={isLoading || !selectedSellStockSymbol || !sellQuantity}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <DollarSign className="h-4 w-4 mr-2" />
                  )}
                  Place Sell Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stock Trading Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2 text-green-600" />
              Trade Your Stocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((stock) => {
                const currentStock = stocks.find(s => s.symbol === stock.symbol);
                if (!currentStock) return null;
                
                return (
                  <div key={stock.symbol} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{stock.symbol}</h3>
                        <p className="text-sm text-gray-600">{(stock as any).name}</p>
                        <p className="text-xs text-gray-500">{stock.shares} shares owned</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">₹{currentStock.price.toFixed(2)}</p>
                        <Badge
                          variant={currentStock.change >= 0 ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {currentStock.change >= 0 ? "+" : ""}{currentStock.changePercent.toFixed(2)}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span>Your Avg Price:</span>
                          <span className="font-medium">₹{stock.buyPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current Value:</span>
                          <span className="font-medium">₹{stock.currentValue.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>P&L:</span>
                          <span className={`font-medium ${stock.gainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {stock.gainLoss >= 0 ? "+" : ""}₹{stock.gainLoss.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500 mb-2">
                          Use the Quick Buy section above to add more shares
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {portfolio.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No stocks in your portfolio yet.</p>
                <p className="text-sm">Use the Quick Buy section above to start trading!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </BankingLayout>
  );
}
