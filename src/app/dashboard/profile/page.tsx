
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/firebase/client"
import { collection, onSnapshot, query, orderBy, doc, getDoc, setDoc, addDoc, runTransaction, serverTimestamp } from "firebase/firestore"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DollarSign, ArrowUpCircle, ArrowDownCircle, History, Package, Loader2, User as UserIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Transaction = {
    id: string;
    date: string;
    type: "deposit" | "withdrawal" | "purchase";
    amount: number;
    status: "Completed" | "Pending" | "Failed";
};

type Order = {
    id: string;
    date: string;
    status: "Paid" | "Pending" | "Refunded";
    total: string;
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [balance, setBalance] = useState(0)
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [amount, setAmount] = useState("")
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch Balance
    const balanceRef = doc(db, "users", user.uid, "balance", "summary");
    const unsubBalance = onSnapshot(balanceRef, (docSnap) => {
      if (docSnap.exists()) {
        setBalance(docSnap.data().currentBalance);
      } else {
        // If no document, balance is 0. It will be created on first transaction.
        setBalance(0);
      }
      setLoadingBalance(false);
    });

    // Fetch Transactions
    const transactionsRef = collection(db, "users", user.uid, "transactions");
    const qTransactions = query(transactionsRef, orderBy("date", "desc"));
    const unsubTransactions = onSnapshot(qTransactions, (snapshot) => {
      const userTransactions: Transaction[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        userTransactions.push({
          id: doc.id,
          date: new Date(data.date.seconds * 1000).toLocaleDateString(),
          type: data.type,
          amount: data.amount,
          status: data.status
        })
      });
      setTransactions(userTransactions);
      setLoadingTransactions(false);
    });

    // Fetch Orders
    const ordersRef = collection(db, "users", user.uid, "orders");
    const qOrders = query(ordersRef, orderBy("date", "desc"));
    const unsubOrders = onSnapshot(qOrders, (querySnapshot) => {
        const userOrders: Order[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            userOrders.push({
                id: doc.id,
                date: new Date(data.date.seconds * 1000).toLocaleDateString(),
                status: data.status,
                total: `$${data.total.toFixed(2)}`,
            });
        });
        setOrders(userOrders);
        setLoadingOrders(false);
    }, (error) => {
        console.error("Error fetching orders: ", error);
        toast({
            title: "Error",
            description: "Could not fetch order history.",
            variant: "destructive",
        });
        setLoadingOrders(false);
    });

    return () => {
      unsubBalance();
      unsubTransactions();
      unsubOrders();
    };
  }, [user, toast]);

  const handleTransaction = async (type: 'deposit' | 'withdraw') => {
    if (!user) return;
    setIsProcessingTransaction(true);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      setIsProcessingTransaction(false);
      return;
    }

    const balanceRef = doc(db, "users", user.uid, "balance", "summary");
    
    try {
        await runTransaction(db, async (transaction) => {
            const balanceDoc = await transaction.get(balanceRef);
            const currentBalance = balanceDoc.exists() ? balanceDoc.data().currentBalance : 0;

            if (type === 'withdraw' && numAmount > currentBalance) {
                throw new Error("Insufficient funds.");
            }

            const newBalance = type === 'deposit' ? currentBalance + numAmount : currentBalance - numAmount;

            transaction.set(balanceRef, { currentBalance: newBalance }, { merge: true });

            const transactionsRef = collection(db, "users", user.uid, "transactions");
            transaction.set(doc(transactionsRef), {
                type: type,
                amount: type === 'deposit' ? numAmount : -numAmount,
                date: serverTimestamp(),
                status: 'Completed'
            });
        });

        toast({
            title: `${type.charAt(0).toUpperCase() + type.slice(1)} Successful`,
            description: `$${numAmount.toFixed(2)} has been processed.`,
        });
        setAmount("");

    } catch (error: any) {
        console.error("Transaction failed: ", error);
        toast({
            title: "Transaction Failed",
            description: error.message || "Could not complete the transaction.",
            variant: "destructive",
        });
    } finally {
        setIsProcessingTransaction(false);
    }
  };


  if (!user) {
    return null;
  }

  const presetAmounts = [10, 20, 50, 100];

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Your personal account information and balance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="font-medium">Email: <span className="font-normal text-muted-foreground">{user.email}</span></p>
              <div className="flex items-center font-semibold text-2xl">
                <DollarSign className="h-6 w-6 mr-2 text-primary" />
                <span>Balance: </span>
                {loadingBalance ? (
                   <Loader2 className="ml-2 h-6 w-6 animate-spin" />
                ) : (
                   <span className="ml-2 font-bold text-primary">${balance.toFixed(2)}</span>
                )}
              </div>
            </div>
            <Avatar className="h-24 w-24">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || ''} />
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                    <UserIcon />
                </AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Manage Funds</CardTitle>
                <CardDescription>Deposit or withdraw funds from your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="deposit" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="deposit"><ArrowUpCircle className="mr-2 h-4 w-4" />Deposit</TabsTrigger>
                        <TabsTrigger value="withdraw"><ArrowDownCircle className="mr-2 h-4 w-4" />Withdraw</TabsTrigger>
                    </TabsList>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 gap-2">
                            {presetAmounts.map(preset => (
                                <Button key={preset} variant="outline" onClick={() => setAmount(String(preset))}>
                                    ${preset}
                                </Button>
                            ))}
                        </div>
                        <Label htmlFor="amount" className="sr-only">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="Or enter a custom amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={isProcessingTransaction}
                        />
                    </div>
                    <TabsContent value="deposit">
                        <Button onClick={() => handleTransaction('deposit')} className="w-full" disabled={isProcessingTransaction}>
                            {isProcessingTransaction ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Deposit Funds
                        </Button>
                    </TabsContent>
                    <TabsContent value="withdraw">
                        <Button onClick={() => handleTransaction('withdraw')} variant="destructive" className="w-full" disabled={isProcessingTransaction}>
                            {isProcessingTransaction ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Withdraw Funds
                        </Button>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><History /> Transaction History</CardTitle>
            <CardDescription>
              View your recent account transactions.
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
             {loadingTransactions ? (
                <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-pulse text-muted-foreground" />
                    <p className="ml-2 text-muted-foreground">Loading transactions...</p>
                </div>
             ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    <p>No transactions found.</p>
                </div>
             ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell>{tx.date}</TableCell>
                                <TableCell className="capitalize">{tx.type}</TableCell>
                                <TableCell><Badge variant={tx.status === 'Completed' ? 'default' : 'secondary'}>{tx.status}</Badge></TableCell>
                                <TableCell className={`text-right font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            View your recent orders and their status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingOrders ? (
            <div className="flex justify-center items-center py-8">
                <Package className="h-8 w-8 animate-pulse text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
             <div className="text-center py-8 text-muted-foreground">
                <p>You haven't placed any orders yet.</p>
             </div>
          ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                        <Badge
                        variant={
                            order.status === "Paid"
                            ? "default"
                            : order.status === "Pending"
                            ? "secondary"
                            : "destructive"
                        }
                        className="capitalize"
                        >
                        {order.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">{order.total}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

    