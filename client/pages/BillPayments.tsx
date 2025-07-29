import { BankingLayout } from "@/components/layout/BankingLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Receipt,
  Zap,
  Smartphone,
  Wifi,
  Car,
  GraduationCap,
  Shield,
  Building,
  CreditCard,
  Clock,
  ChevronRight,
  Star,
} from "lucide-react";

export default function BillPayments() {
  const billCategories = [
    {
      title: "Pay Bills",
      description: "Pay utility bills and other services",
      icon: Receipt,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      popular: true,
    },
    {
      title: "Payment History",
      description: "View your past bill payments",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Topup Recharge",
      description: "Mobile and DTH recharge services",
      icon: Smartphone,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      popular: true,
    },
    {
      title: "SBI General Premium",
      description: "Pay insurance premiums easily",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const billTypes = [
    {
      category: "Utilities",
      bills: [
        {
          name: "Electricity Bill",
          icon: Zap,
          providers: ["KSEB", "MSEB", "TSEB", "BESCOM"],
        },
        {
          name: "Gas Bill",
          icon: Building,
          providers: ["Indane", "Bharat Gas", "HP Gas"],
        },
        {
          name: "Water Bill",
          icon: Building,
          providers: ["Municipal Corporation", "Water Board"],
        },
      ],
    },
    {
      category: "Telecom",
      bills: [
        {
          name: "Mobile Recharge",
          icon: Smartphone,
          providers: ["Airtel", "Jio", "BSNL", "Vi"],
        },
        {
          name: "DTH Recharge",
          icon: Wifi,
          providers: ["Tata Sky", "Airtel Digital TV", "Dish TV"],
        },
        {
          name: "Broadband",
          icon: Wifi,
          providers: ["BSNL", "Airtel", "Jio Fiber"],
        },
      ],
    },
    {
      category: "Financial",
      bills: [
        {
          name: "Credit Card",
          icon: CreditCard,
          providers: ["SBI Card", "HDFC", "ICICI", "Axis"],
        },
        {
          name: "Loan EMI",
          icon: Building,
          providers: ["Home Loan", "Personal Loan", "Car Loan"],
        },
        {
          name: "Insurance Premium",
          icon: Shield,
          providers: ["LIC", "SBI Life", "HDFC Life"],
        },
      ],
    },
    {
      category: "Others",
      bills: [
        {
          name: "Municipal Tax",
          icon: Building,
          providers: ["Property Tax", "Water Tax"],
        },
        {
          name: "Education Fee",
          icon: GraduationCap,
          providers: ["School Fee", "College Fee"],
        },
        {
          name: "Traffic Challan",
          icon: Car,
          providers: ["Traffic Police", "e-Challan"],
        },
      ],
    },
  ];

  const recentPayments = [
    {
      id: 1,
      service: "Electricity Bill - KSEB",
      amount: 2500,
      date: "2024-01-15",
      status: "Success",
      billNumber: "EB123456789",
    },
    {
      id: 2,
      service: "Mobile Recharge - Jio",
      amount: 599,
      date: "2024-01-14",
      status: "Success",
      billNumber: "9876543210",
    },
    {
      id: 3,
      service: "DTH Recharge - Tata Sky",
      amount: 400,
      date: "2024-01-13",
      status: "Success",
      billNumber: "DT987654321",
    },
  ];

  return (
    <BankingLayout>
      <div className="space-y-6 animate-slide-in">
        {/* Header */}
        <div className="bg-banking-gradient rounded-lg p-6 text-white">
          <div className="flex items-center">
            <Receipt className="h-8 w-8 mr-4" />
            <div>
              <h1 className="text-2xl font-bold">Bill Payments</h1>
              <p className="text-blue-100">
                Pay all your bills conveniently in one place
              </p>
            </div>
          </div>
        </div>

        {/* Main Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {billCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer group relative"
              >
                {category.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-500 hover:bg-orange-600">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
                <CardContent className="p-6 text-center">
                  <div
                    className={`${category.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className={`h-8 w-8 ${category.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-banking-blue-600 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {category.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Access
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bill Types by Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {billTypes.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.bills.map((bill, billIndex) => {
                    const Icon = bill.icon;
                    return (
                      <div
                        key={billIndex}
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="bg-gray-100 p-2 rounded-lg">
                              <Icon className="h-5 w-5 text-gray-600" />
                            </div>
                            <span className="font-medium text-gray-900">
                              {bill.name}
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {bill.providers
                            .slice(0, 3)
                            .map((provider, providerIndex) => (
                              <Badge
                                key={providerIndex}
                                variant="secondary"
                                className="text-xs"
                              >
                                {provider}
                              </Badge>
                            ))}
                          {bill.providers.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{bill.providers.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Payments and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Receipt className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {payment.service}
                        </p>
                        <p className="text-sm text-gray-600">
                          {payment.billNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{payment.amount.toLocaleString("en-IN")}
                      </p>
                      <Badge
                        variant="default"
                        className="text-xs bg-green-100 text-green-800"
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View Payment History
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Quick Recharge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Smartphone className="h-6 w-6 text-blue-600" />
                    <span className="text-xs">Mobile</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Wifi className="h-6 w-6 text-purple-600" />
                    <span className="text-xs">DTH</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Building className="h-6 w-6 text-green-600" />
                    <span className="text-xs">Broadband</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <CreditCard className="h-6 w-6 text-orange-600" />
                    <span className="text-xs">Credit Card</span>
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Benefits of Bill Payment
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Instant payment confirmation</li>
                    <li>• Save on service charges</li>
                    <li>• Auto-pay facility available</li>
                    <li>• Earn reward points</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Offers and Promotions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Current Offers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-r from-orange-100 to-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-2">
                  Mobile Recharge Cashback
                </h4>
                <p className="text-sm text-orange-700">
                  Get 2% cashback on mobile recharges above ₹500
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-orange-600 text-sm mt-2"
                >
                  Learn More →
                </Button>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-100 to-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">
                  Electricity Bill Rewards
                </h4>
                <p className="text-sm text-green-700">
                  Earn reward points on utility bill payments
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-green-600 text-sm mt-2"
                >
                  Learn More →
                </Button>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">
                  Auto-Pay Benefits
                </h4>
                <p className="text-sm text-purple-700">
                  Set up auto-pay and never miss a due date
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-purple-600 text-sm mt-2"
                >
                  Set Up Now →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BankingLayout>
  );
}
