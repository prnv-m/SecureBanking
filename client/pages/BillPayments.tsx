import React, { useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { BankingLayout } from '@/components/layout/BankingLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Receipt, Zap, Smartphone, Wifi, Building, CreditCard, Clock, ChevronRight, Star, ArrowLeft, CheckCircle, Wallet, Download, Shield, Plus, Trash2, Settings, XCircle, Loader2
} from 'lucide-react';
import { useAuth, Transaction } from "@/contexts/AuthContext";
import { billPaymentsApi, Biller, AutoPayRule } from "@/services/billPaymentsApi";

// --- CONSTANTS & HELPERS ---
const staticBillTypes = [
    { category: "Utilities", bills: [{ name: "Electricity Bill", icon: Zap, providers: ["KSEB", "MSEB"] }, { name: "Gas Bill", icon: Building, providers: ["Indane", "Bharat Gas"] }] },
    { category: "Telecom", bills: [{ name: "Mobile Recharge", icon: Smartphone, providers: ["Airtel", "Jio", "Vi"] }, { name: "DTH Recharge", icon: Wifi, providers: ["Tata Sky", "Airtel Digital TV"] }] },
    { category: "Financial", bills: [{ name: "Credit Card", icon: CreditCard, providers: ["SBI Card", "HDFC Bank"] }, { name: "Loan EMI", icon: Building, providers: ["Home Loan", "Personal Loan"] }] },
];
const generateReceipt = (payment: Transaction) => alert(`RECEIPT\n----------\nTransaction ID: ${payment.id}\nDescription: ${payment.description}\nAmount: ₹${payment.amount.toLocaleString('en-IN')}\nDate: ${new Date(payment.createdAt).toLocaleString()}`);
const Modal = ({ children, onClose }: { children: ReactNode; onClose: () => void }) => (<div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}><div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>{children}</div></div>);

// --- VIEW COMPONENTS (UI Only) ---

const DashboardView = ({ user, registeredBillers, onCategoryClick, onPayBillerClick, onDeleteBiller }) => (
    <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white flex justify-between items-center">
            <div><h1 className="text-2xl font-bold">Bill Payments</h1><p className="text-blue-100">Your one-stop payment hub</p></div>
            <div className="text-right"><div className="flex items-center mb-1"><Wallet className="h-5 w-5 mr-2" /><span className="text-sm">Available Balance</span></div><p className="text-2xl font-bold">₹{user.balance.toLocaleString('en-IN')}</p></div>
        </div>
        <Card>
            <CardHeader><CardTitle>Your Registered Billers</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 cursor-pointer border-2 border-dashed" onClick={() => onCategoryClick('billTypes')}><Plus className="h-8 w-8 text-blue-500 mb-2" /><p className="font-semibold text-blue-700">Add New Biller</p></Card>
                    {registeredBillers.map(biller => (
                        <div key={biller.id} className="p-4 border rounded-lg flex flex-col justify-between hover:shadow-md">
                            <div><p className="font-semibold">{biller.nickname}</p><p className="text-sm text-gray-500">{biller.provider_name}</p><p className="text-xs text-gray-400">ID: {biller.consumer_id}</p></div>
                            <div className="flex gap-2 mt-3"><Button className="w-full" onClick={() => onPayBillerClick(biller)}>Pay</Button><Button variant="destructive" size="icon" onClick={() => onDeleteBiller(biller.id)}><Trash2 className="h-4 w-4"/></Button></div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg cursor-pointer" onClick={() => onCategoryClick('history')}><CardHeader><CardTitle className="flex items-center"><Clock className="mr-2 text-green-600"/>Payment History</CardTitle></CardHeader></Card>
            <Card className="hover:shadow-lg cursor-pointer" onClick={() => onCategoryClick('autopay')}><CardHeader><CardTitle className="flex items-center"><Settings className="mr-2 text-purple-600"/>Manage Auto Pay</CardTitle></CardHeader></Card>
        </div>
    </div>
);

const BillTypesView = ({ onBack, onBillSelect }) => (
    <div className="space-y-6">
        <div className="flex items-center"><Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4"/>Back</Button><h2 className="text-2xl font-bold">Select Bill to Add</h2></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {staticBillTypes.map(c => <Card key={c.category}><CardHeader><CardTitle>{c.category}</CardTitle></CardHeader><CardContent className="space-y-3">{c.bills.map(b => <button key={b.name} onClick={() => onBillSelect(b.name, b.providers)} className="w-full text-left flex items-center p-3 border rounded-lg hover:bg-gray-50"><b.icon className="h-5 w-5 mr-3 text-gray-500"/><span>{b.name}</span><ChevronRight className="h-4 w-4 ml-auto"/></button>)}</CardContent></Card>)}
        </div>
    </div>
);

const HistoryView = ({ onBack, paymentHistory }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredHistory = useMemo(() => paymentHistory.filter(p => p.description.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase())), [paymentHistory, searchTerm]);
    return (<div className="space-y-6">
        <div className="flex items-center"><Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4"/>Back</Button><h2 className="text-2xl font-bold">Payment History</h2></div>
        <Card>
            <CardHeader><Input placeholder="Search by description or Transaction ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/></CardHeader>
            <CardContent>{filteredHistory.length > 0 ? <div className="space-y-3">{filteredHistory.map(p => <div key={p.id} className="p-4 border-b flex justify-between items-center"><div><p className="font-semibold">{p.description}</p><p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleString()}</p></div><div className="text-right"><p className="font-bold text-lg text-red-600">-₹{p.amount.toLocaleString('en-IN')}</p><Button variant="outline" size="sm" className="mt-1" onClick={()=>generateReceipt(p)}><Download className="h-4 w-4 mr-2"/>Receipt</Button></div></div>)}</div> : <p>No transactions found for your search.</p>}</CardContent>
        </Card>
    </div>);
};

const AutoPayView = ({ onBack, autoPayRules, registeredBillers, onAddRule, onToggleRule, onDeleteRule }) => {
    const [form, setForm] = useState({ biller_id: '', max_amount: '' });
    return (<div className="space-y-6">
        <div className="flex items-center"><Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4"/>Back</Button><h2 className="text-2xl font-bold">Auto Pay Setup</h2></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle>Add New Auto Pay Rule</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={e => { e.preventDefault(); onAddRule(form.biller_id, form.max_amount); }} className="space-y-4">
                        <div><Label>Select Biller</Label><Select value={form.biller_id} onValueChange={v=>setForm(p=>({...p, biller_id:v}))}><SelectTrigger><SelectValue placeholder="Choose a biller..."/></SelectTrigger><SelectContent>{registeredBillers.map(b=><SelectItem key={b.id} value={b.id}>{b.nickname}</SelectItem>)}</SelectContent></Select></div>
                        <div><Label>Max Amount (₹)</Label><Input type="number" value={form.max_amount} onChange={e=>setForm(p=>({...p,max_amount:e.target.value}))} required/></div>
                        <Button type="submit" className="w-full" disabled={!form.biller_id || !form.max_amount}>Add Rule</Button>
                    </form>
                </CardContent>
            </Card>
            <Card><CardHeader><CardTitle>Your Auto Pay Rules</CardTitle></CardHeader>
                <CardContent>{autoPayRules.length > 0 ? <div className="space-y-3">{autoPayRules.map(r=><div key={r.id} className="p-3 border rounded-lg"><div><p className="font-semibold">{r.nickname}</p><p className="text-sm text-gray-500">Max Amount: ₹{r.max_amount.toLocaleString('en-IN')}</p></div><div className="flex items-center justify-between mt-2"><Badge className={r.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>{r.enabled?'Active':'Paused'}</Badge><div className="flex gap-2"><Button size="sm" variant="outline" onClick={()=>onToggleRule(r.id, !r.enabled)}><Settings className="h-4 w-4"/></Button><Button size="sm" variant="destructive" onClick={()=>onDeleteRule(r.id)}><Trash2 className="h-4 w-4"/></Button></div></div></div>)}</div> : <p>No rules set up.</p>}</CardContent>
            </Card>
        </div>
    </div>);
};


// --- MAIN CONTROLLER COMPONENT ---
export default function BillPayments() {
    const { user, fetchAndSetProfile } = useAuth();
    const [currentView, setCurrentView] = useState<'dashboard' | 'billTypes' | 'history' | 'autopay'>('dashboard');
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // API Data
    const [registeredBillers, setRegisteredBillers] = useState<Biller[]>([]);
    const [paymentHistory, setPaymentHistory] = useState<Transaction[]>([]);
    const [autoPayRules, setAutoPayRules] = useState<AutoPayRule[]>([]);

    // Modal States
    const [paymentModalBiller, setPaymentModalBiller] = useState<Biller | null>(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [addBillerModalContext, setAddBillerModalContext] = useState<{ categoryName: string; providers: string[] } | null>(null);
    const [addBillerForm, setAddBillerForm] = useState({ provider_name: '', consumer_id: '', nickname: '' });

    // --- DATA FETCHING ---
    const loadAllData = useCallback(async () => {
        setIsLoading(true);
        const [billersRes, historyRes, autoPayRes] = await Promise.all([
            billPaymentsApi.getRegisteredBillers(),
            billPaymentsApi.getPaymentHistory(),
            billPaymentsApi.getAutoPayRules(),
        ]);
        if (billersRes.success) setRegisteredBillers(billersRes.billers || []);
        if (historyRes.success) setPaymentHistory(historyRes.transactions || []);
        if (autoPayRes.success) setAutoPayRules(autoPayRes.rules || []);
        setIsLoading(false);
    }, []);

    useEffect(() => { if (user) loadAllData(); }, [user, loadAllData]);

    // --- HANDLER FUNCTIONS ---
    const handleBillSelect = (categoryName: string, providers: string[]) => {
        setAddBillerModalContext({ categoryName, providers });
        setAddBillerForm({ provider_name: providers[0], consumer_id: '', nickname: '' });
    };

    const handleAddBillerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addBillerModalContext) return;
        setIsProcessing(true);
        const res = await billPaymentsApi.addBiller({ ...addBillerForm, category: addBillerModalContext.categoryName });
        if (res.success && res.biller) {
            setRegisteredBillers(prev => [res.biller, ...prev]);
            setAddBillerModalContext(null);
        } else { alert(res.error || "Failed to add biller."); }
        setIsProcessing(false);
    };

    const handleDeleteBiller = async (billerId: string) => {
        if (!window.confirm("Are you sure you want to delete this biller? This will also remove any associated auto-pay rules.")) return;
        const res = await billPaymentsApi.deleteBiller(billerId);
        if (res.success) {
            setRegisteredBillers(prev => prev.filter(b => b.id !== billerId));
            setAutoPayRules(prev => prev.filter(r => r.biller_id !== billerId));
        } else { alert(res.error || "Failed to delete biller."); }
    };

    const handlePaySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentModalBiller || !paymentAmount) return;
        setIsProcessing(true);
        const res = await billPaymentsApi.payBill(paymentModalBiller.id, parseFloat(paymentAmount));
        if (res.success) {
            alert(res.message);
            await fetchAndSetProfile();
            await loadAllData();
            setPaymentModalBiller(null);
        } else { alert(res.error || "Payment failed."); }
        setIsProcessing(false);
    };

    const handleAddAutoPay = async (biller_id: string, max_amount: string) => {
        if(!biller_id || !max_amount) { alert("Please select a biller and enter a max amount."); return; }
        const res = await billPaymentsApi.addAutoPayRule(biller_id, parseFloat(max_amount));
        if (res.success) { alert("Auto-Pay rule added!"); await loadAllData(); }
        else alert(res.error || "Failed to add rule.");
    };
    
    const handleToggleAutoPay = async (rule_id: string, enabled: boolean) => {
        const res = await billPaymentsApi.toggleAutoPayRule(rule_id, enabled);
        if (res.success) setAutoPayRules(prev => prev.map(r => r.id === rule_id ? {...r, enabled: enabled ? 1 : 0} : r));
        else alert(res.error || "Failed to update rule.");
    };

    const handleDeleteAutoPay = async (rule_id: string) => {
        if (!window.confirm("Are you sure you want to delete this auto-pay rule?")) return;
        const res = await billPaymentsApi.deleteAutoPayRule(rule_id);
        if (res.success) setAutoPayRules(prev => prev.filter(r => r.id !== rule_id));
        else alert(res.error || "Failed to delete rule.");
    };

    const renderView = () => {
        if (isLoading || !user) return <div className="text-center p-10"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>;
        switch (currentView) {
            case 'dashboard': return <DashboardView user={user} registeredBillers={registeredBillers} onCategoryClick={setCurrentView} onPayBillerClick={setPaymentModalBiller} onDeleteBiller={handleDeleteBiller} />;
            case 'billTypes': return <BillTypesView onBack={() => setCurrentView('dashboard')} onBillSelect={handleBillSelect} />;
            case 'history': return <HistoryView onBack={() => setCurrentView('dashboard')} paymentHistory={paymentHistory} />;
            case 'autopay': return <AutoPayView onBack={() => setCurrentView('dashboard')} autoPayRules={autoPayRules} registeredBillers={registeredBillers} onAddRule={handleAddAutoPay} onToggleRule={handleToggleAutoPay} onDeleteRule={handleDeleteAutoPay} />;
            default: return <p>Invalid view.</p>;
        }
    };

    return (
        <BankingLayout>
            <div>{renderView()}</div>
            {addBillerModalContext && <Modal onClose={() => setAddBillerModalContext(null)}><form onSubmit={handleAddBillerSubmit} className="space-y-4"><h2 className="text-xl font-bold">Add: {addBillerModalContext.categoryName}</h2><div><Label>Provider</Label><Select value={addBillerForm.provider_name} onValueChange={v=>setAddBillerForm(p=>({...p, provider_name:v}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{addBillerModalContext.providers.map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div><div><Label>Consumer ID/Number</Label><Input value={addBillerForm.consumer_id} onChange={e=>setAddBillerForm(p=>({...p, consumer_id: e.target.value}))} required/></div><div><Label>Nickname</Label><Input value={addBillerForm.nickname} onChange={e=>setAddBillerForm(p=>({...p, nickname: e.target.value}))} required/></div><div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={()=>setAddBillerModalContext(null)}>Cancel</Button><Button type="submit" disabled={isProcessing}>{isProcessing?<Loader2 className="animate-spin"/>:"Add Biller"}</Button></div></form></Modal>}
            {paymentModalBiller && <Modal onClose={() => setPaymentModalBiller(null)}><form onSubmit={handlePaySubmit} className="space-y-4"><h2 className="text-xl font-bold">Pay Bill</h2><div><p className="font-semibold">{paymentModalBiller.nickname}</p><p className="text-sm text-gray-500">{paymentModalBiller.provider_name}</p></div><div><Label>Amount (₹)</Label><Input type="number" value={paymentAmount} onChange={e=>setPaymentAmount(e.target.value)} required autoFocus/></div><div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={()=>setPaymentModalBiller(null)}>Cancel</Button><Button type="submit" disabled={isProcessing}>{isProcessing?<Loader2 className="animate-spin"/>:`Pay ₹${paymentAmount||0}`}</Button></div></form></Modal>}
        </BankingLayout>
    );
}