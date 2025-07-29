import { BankingLayout } from "@/components/layout/BankingLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Send,
  UserPlus,
  Building,
  CreditCard,
  Smartphone,
  ArrowRightLeft,
  Clock,
  Shield,
  ChevronRight,
  Settings,
} from "lucide-react";

export default function PaymentsTransfers() {
  const transferServices = [
    {
      title: "Add & Manage Beneficiary",
      description: "Add new beneficiaries and manage existing ones",
      icon: UserPlus,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/transfers/beneficiary",
    },
    {
      title: "Funds Transfer (Own SBI A/c)",
      description: "Transfer money between your SBI accounts",
      icon: ArrowRightLeft,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/transfers/own-account",
    },
    {
      title: "Accounts of Others - Within SBI",
      description: "Transfer to other SBI account holders",
      icon: Building,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: "/transfers/within-sbi",
    },
    {
      title: "Other Bank Transfer",
      description: "Transfer to accounts in other banks via NEFT/RTGS",
      icon: Building,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      href: "/transfers/other-bank",
    },
    {
      title: "IMPS Funds Transfer",
      description: "Instant money transfer using IMPS",
      icon: Send,
      color: "text-red-600",
      bgColor: "bg-red-100",
      href: "/transfers/imps",
    },
    {
      title: "VAN (Virtual Account Number) Funds Transfer",
      description: "Transfer using Virtual Account Number",
      icon: CreditCard,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      href: "/transfers/van",
    },
    {
      title: "Quick Transfer (Without Adding Beneficiary)",
      description: "One-time transfer without saving beneficiary",
      icon: Send,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
      href: "/transfers/quick",
    },
  ];

  const recentTransfers = [
    {
      id: 1,
      beneficiary: "John Doe",
      account: "****5678",
      amount: 10000,
      date: "2024-01-15",
      status: "Completed",
      type: "IMPS",
    },
    {
      id: 2,
      beneficiary: "Electricity Board",
      account: "****9012",
      amount: 2500,
      date: "2024-01-14",
      status: "Completed",
      type: "NEFT",
    },
    {
      id: 3,
      beneficiary: "Mobile Recharge",
      account: "****3456",
      amount: 500,
      date: "2024-01-13",
      status: "Completed",
      type: "IMPS",
    },
  ];

  return (
    <BankingLayout>
      <div className="space-y-6 animate-slide-in">
        {/* Header */}
        <div className="bg-banking-gradient rounded-lg p-6 text-white">
          <div className="flex items-center">
            <Send className="h-8 w-8 mr-4" />
            <div>
              <h1 className="text-2xl font-bold">Payments / Transfers</h1>
              <p className="text-blue-100">
                Transfer money securely and instantly
              </p>
            </div>
          </div>
        </div>

        {/* Transfer Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transferServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`${service.bgColor} p-3 rounded-lg`}>
                      <Icon className={`h-6 w-6 ${service.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-banking-blue-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {service.description}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto text-banking-blue-600 hover:text-banking-blue-700"
                      >
                        Access Service
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Recent Transfers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Send className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transfer.beneficiary}
                        </p>
                        <p className="text-sm text-gray-600">
                          {transfer.account} • {transfer.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{transfer.amount.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-green-600">
                        {transfer.status}
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Transfers
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Security Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg mt-1">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-sm text-gray-600">
                      Every transaction requires OTP verification
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg mt-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Transaction Limits
                    </h4>
                    <p className="text-sm text-gray-600">
                      Daily transfer limit: ₹2,00,000
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg mt-1">
                    <Send className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Instant Notifications
                    </h4>
                    <p className="text-sm text-gray-600">
                      SMS and email alerts for all transactions
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Security Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transfer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Transfer Information & Limits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">IMPS Transfers</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Available 24x7</li>
                  <li>• Instant transfer</li>
                  <li>• Limit: ₹2,00,000 per day</li>
                  <li>• Service charges apply</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">NEFT Transfers</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Available 24x7</li>
                  <li>• Settlement in 2 hours</li>
                  <li>• No upper limit</li>
                  <li>• Lower service charges</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">RTGS Transfers</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Working hours only</li>
                  <li>• Real-time settlement</li>
                  <li>• Minimum: ₹2,00,000</li>
                  <li>• Higher service charges</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* More Services */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              More Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-blue-600 font-medium cursor-pointer hover:underline">
              &gt;&gt; View More Transfer Options
            </div>
          </CardContent>
        </Card>
      </div>
    </BankingLayout>
  );
}
