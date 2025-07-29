import { useState, useEffect } from "react";
import { BankingLayout } from "@/components/layout/BankingLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { accountStatementApi, type AccountStatement as AccountStatementData, type StatementEntry } from "@/services/api";
import { FileText, Download, Eye, Calendar, Filter, Loader2 } from "lucide-react";

export default function AccountStatement() {
  const [selectedAccount, setSelectedAccount] = useState("000000414046934930");
  const [statementPeriod, setStatementPeriod] = useState("byDate");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [viewOption, setViewOption] = useState("view");
  const [recordsPerPage, setRecordsPerPage] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [statement, setStatement] = useState<AccountStatementData | null>(null);
  const { toast } = useToast();

  const accounts = [
    {
      id: "000000414046934930",
      type: "Savings Account",
      branch: "OLAVAKKOT",
      nickname: "Primary Savings",
    },
  ];

  const generateStatement = async () => {
    if (statementPeriod === "byDate" && (!startDate || !endDate)) {
      toast({
        title: "Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const params: any = {
        period: statementPeriod,
        records_per_page: recordsPerPage,
      };

      if (statementPeriod === "byDate") {
        params.start_date = startDate;
        params.end_date = endDate;
      }

      const response = await accountStatementApi.getStatement(params) as any;

      if (response.success) {
        setStatement(response.statement);
        toast({
          title: "Success",
          description: "Account statement generated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to generate statement",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate statement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportStatement = async (format: 'pdf' | 'excel') => {
    try {
      setIsLoading(true);
      const data: any = {
        format,
        period: statementPeriod,
      };

      if (statementPeriod === "byDate") {
        data.start_date = startDate;
        data.end_date = endDate;
      }

      const response = await accountStatementApi.exportStatement(data) as any;

      if (response.success) {
        // Generate and download file content
        const content = generateExportContent(response.exportData, format);
        const blob = new Blob([content], { 
          type: format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel' 
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `account-statement-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast({
          title: "Success",
          description: `Statement exported successfully in ${format.toUpperCase()} format`,
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to export statement",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to export statement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateExportContent = (data: any, format: string) => {
    if (format === 'pdf') {
      return `
Account Statement - ${data.customerName}
Account: ${data.accountNumber}
Period: ${data.period}
Generated: ${data.exportDate}

Transactions:
${data.transactions.map((t: any) => `
Date: ${t.date}
Description: ${t.description}
Type: ${t.type}
Amount: ₹${t.amount}
Status: ${t.status}
`).join('\n')}
      `;
    } else {
      return `
Date,Description,Type,Amount,Status
${data.transactions.map((t: any) => 
  `${t.date},"${t.description}",${t.type},${t.amount},${t.status}`
).join('\n')}
      `;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <BankingLayout>
      <div className="space-y-6 animate-slide-in">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-600">
          <span>You are here:</span>
          <span className="mx-2">/</span>
          <span className="text-banking-blue-600">My Accounts & Profile</span>
          <span className="mx-2">/</span>
          <span className="text-banking-blue-600 font-medium">
            Account Statement
          </span>
        </nav>

        <Card>
          <CardHeader className="bg-banking-blue-100/50">
            <CardTitle className="text-xl font-bold text-banking-blue-700 flex items-center">
              <FileText className="h-6 w-6 mr-3" />
              Account Statement
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Account Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-3 block">
                  Select an account
                </Label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="account1"
                        name="account"
                        checked={selectedAccount === "000000414046934930"}
                        onChange={() =>
                          setSelectedAccount("000000414046934930")
                        }
                        className="h-4 w-4 text-banking-blue-600"
                      />
                      <label
                        htmlFor="account1"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium text-gray-900">
                          000000414046934930
                        </div>
                        <div className="text-sm text-gray-600">
                          Savings Account
                        </div>
                      </label>
                    </div>
                    <Badge variant="secondary">OLAVAKKOT</Badge>
                  </div>
                </div>

                <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Selected Account Number:</strong> 000000414046934930
                  </p>
                </div>
              </div>

              {/* Statement Period Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-3 block">
                  Select options for the statement period
                </Label>
                <RadioGroup
                  value={statementPeriod}
                  onValueChange={setStatementPeriod}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="byDate" id="byDate" />
                    <Label htmlFor="byDate">By Date</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="byMonth" id="byMonth" />
                    <Label htmlFor="byMonth">By Month</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="last6Months" id="last6Months" />
                    <Label htmlFor="last6Months">Last 6 Months</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="financialYear" id="financialYear" />
                    <Label htmlFor="financialYear">Financial Year</Label>
                  </div>
                </RadioGroup>

                {statementPeriod === "byDate" && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="startDate"
                        className="text-sm font-medium text-gray-700"
                      >
                        Start Date
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="dd/mm/yyyy"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="endDate"
                        className="text-sm font-medium text-gray-700"
                      >
                        End Date
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="dd/mm/yyyy"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    In case the Account Statement does not reflect all your
                    transactions, please{" "}
                    <span className="text-banking-blue-600 font-medium cursor-pointer hover:underline">
                      Download statement from the 'Pending Statement' link
                    </span>{" "}
                    under the 'My Accounts' tab after some time.
                  </p>
                </div>
              </div>

              {/* View Options */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-3 block">
                  Select appropriate options to view, print or download the
                  statement
                </Label>

                <RadioGroup value={viewOption} onValueChange={setViewOption}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="view" id="view" />
                    <Label htmlFor="view">View</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="downloadExcel" id="downloadExcel" />
                    <Label htmlFor="downloadExcel">
                      Download in MS Excel format
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="downloadPDF" id="downloadPDF" />
                    <Label htmlFor="downloadPDF">Download in PDF format</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="uploadDigiLocker"
                      id="uploadDigiLocker"
                    />
                    <Label htmlFor="uploadDigiLocker">
                      Upload to DigiLocker
                    </Label>
                  </div>
                </RadioGroup>

                <div className="mt-4">
                  <Label
                    htmlFor="recordsPerPage"
                    className="text-sm font-medium text-gray-700"
                  >
                    Number of Records Per Page
                  </Label>
                  <Select
                    value={recordsPerPage}
                    onValueChange={setRecordsPerPage}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">ALL</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button 
                  className="bg-banking-orange-500 hover:bg-banking-orange-600 text-white px-8"
                  onClick={generateStatement}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  Generate Statement
                </Button>
                <Button variant="outline" className="px-8">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statement Preview */}
        {statement && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Statement Preview
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => exportStatement('pdf')}
                    disabled={isLoading}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => exportStatement('excel')}
                    disabled={isLoading}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export Excel
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">
                      Account Number: {statement.accountNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      Period: {statement.period}
                      {statement.startDate && statement.endDate && 
                        ` (${formatDate(statement.startDate)} - ${formatDate(statement.endDate)})`
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Records</p>
                    <p className="font-semibold">{statement.totalRecords}</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-left py-3 px-4 font-medium">
                          Description
                        </th>
                        <th className="text-right py-3 px-4 font-medium">
                          Debit
                        </th>
                        <th className="text-right py-3 px-4 font-medium">
                          Credit
                        </th>
                        <th className="text-right py-3 px-4 font-medium">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {statement.entries.map((entry, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{formatDate(entry.date)}</td>
                          <td className="py-3 px-4">{entry.description}</td>
                          <td className="py-3 px-4 text-right">
                            {entry.debit !== '-' ? (
                              <span className="text-red-600">{entry.debit}</span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {entry.credit !== '-' ? (
                              <span className="text-green-600">{entry.credit}</span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            {entry.balance}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {statement.entries.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No transactions found for the selected period.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </BankingLayout>
  );
}
