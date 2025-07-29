import { BankingLayout } from "@/components/layout/BankingLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Building,
  Receipt,
  Calculator,
  Download,
  Upload,
  Clock,
  Shield,
  ChevronRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function ETax() {
  const taxServices = [
    {
      title: "State Govt. Taxes",
      description: "Pay state government taxes and levies",
      icon: Building,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      services: [
        "Property Tax",
        "Professional Tax",
        "Motor Vehicle Tax",
        "State GST",
      ],
    },
    {
      title: "Indirect Taxes",
      description: "GST and other indirect tax payments",
      icon: Receipt,
      color: "text-green-600",
      bgColor: "bg-green-100",
      services: ["GST Payment", "Service Tax", "Excise Duty", "Customs Duty"],
    },
    {
      title: "Direct Taxes",
      description: "Income tax and direct tax services",
      icon: Calculator,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      services: [
        "Income Tax",
        "TDS Payment",
        "Advance Tax",
        "Self Assessment Tax",
      ],
    },
    {
      title: "Reprint Challan/Receipt",
      description: "Download previous tax payment receipts",
      icon: Download,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      services: [
        "Tax Receipts",
        "Challan Copy",
        "Payment History",
        "Compliance Reports",
      ],
    },
  ];

  const recentTaxPayments = [
    {
      id: 1,
      type: "Income Tax",
      amount: 50000,
      date: "2024-01-15",
      status: "Completed",
      challanNo: "CHL123456789",
      assessmentYear: "2023-24",
    },
    {
      id: 2,
      type: "Property Tax",
      amount: 12000,
      date: "2024-01-10",
      status: "Completed",
      challanNo: "CHL987654321",
      assessmentYear: "2023-24",
    },
    {
      id: 3,
      type: "GST Payment",
      amount: 25000,
      date: "2024-01-05",
      status: "Completed",
      challanNo: "CHL555666777",
      assessmentYear: "2023-24",
    },
  ];

  const taxReminders = [
    {
      type: "Income Tax Return",
      dueDate: "2024-07-31",
      status: "Due",
      priority: "high",
    },
    {
      type: "GST Return",
      dueDate: "2024-02-20",
      status: "Due Soon",
      priority: "medium",
    },
    {
      type: "TDS Return",
      dueDate: "2024-01-31",
      status: "Due Soon",
      priority: "high",
    },
  ];

  return (
    <BankingLayout>
      <div className="space-y-6 animate-slide-in">
        {/* Header */}
        <div className="bg-banking-gradient rounded-lg p-6 text-white">
          <div className="flex items-center">
            <FileText className="h-8 w-8 mr-4" />
            <div>
              <h1 className="text-2xl font-bold">e-Tax Services</h1>
              <p className="text-blue-100">
                Complete tax payment solutions at your fingertips
              </p>
            </div>
          </div>
        </div>

        {/* Tax Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {taxServices.map((service, index) => {
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
                      <div className="flex flex-wrap gap-2 mb-4">
                        {service.services.slice(0, 2).map((item, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {item}
                          </Badge>
                        ))}
                        {service.services.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{service.services.length - 2} more
                          </Badge>
                        )}
                      </div>
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

        {/* Recent Payments and Reminders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Recent Tax Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTaxPayments.map((payment) => (
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
                          {payment.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          AY: {payment.assessmentYear}
                        </p>
                        <p className="text-xs text-gray-500">
                          {payment.challanNo}
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
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Tax Payments
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                Tax Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxReminders.map((reminder, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          reminder.priority === "high"
                            ? "bg-red-100"
                            : "bg-yellow-100"
                        }`}
                      >
                        <AlertCircle
                          className={`h-4 w-4 ${
                            reminder.priority === "high"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {reminder.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          Due: {reminder.dueDate}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        reminder.priority === "high"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {reminder.status}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Set Tax Reminders
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tax Tools and Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Tax Calculators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calculator className="h-4 w-4 mr-2" />
                  Income Tax Calculator
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calculator className="h-4 w-4 mr-2" />
                  GST Calculator
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calculator className="h-4 w-4 mr-2" />
                  TDS Calculator
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calculator className="h-4 w-4 mr-2" />
                  EMI Calculator
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Tax Forms & Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Form 16 Download
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  TDS Certificates
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Tax Documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Tax Filing Status
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Security & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-1 rounded-full mt-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      SSL Encrypted
                    </p>
                    <p className="text-xs text-gray-600">
                      All transactions are secured
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-1 rounded-full mt-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Government Integrated
                    </p>
                    <p className="text-xs text-gray-600">
                      Direct payment to govt portals
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-1 rounded-full mt-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Instant Receipts
                    </p>
                    <p className="text-xs text-gray-600">
                      Get challan immediately
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Important Tax Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Due Dates Reminder
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Income Tax Return (Individual):</span>
                    <span className="font-medium">31st July</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST Return (Monthly):</span>
                    <span className="font-medium">20th of next month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TDS Return (Quarterly):</span>
                    <span className="font-medium">31st of next month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Advance Tax (Quarterly):</span>
                    <span className="font-medium">15th Jun, Sep, Dec, Mar</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Service Charges
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Income Tax Payment:</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST Payment:</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>State Tax Payment:</span>
                    <span className="font-medium">₹5 + GST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Challan Reprint:</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                </div>
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
              &gt;&gt; Explore All Tax Services
            </div>
          </CardContent>
        </Card>
      </div>
    </BankingLayout>
  );
}
