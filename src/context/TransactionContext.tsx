import { createContext, useContext, useState, ReactNode } from 'react';

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
}

interface TransactionContextType {
    transactions: Transaction[];
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: string) => void;
    stats: {
        totalPortfolio: number;
        monthlyReturn: number;
        income: number;
        expenses: number;
    };
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

const MOCK_TRANSACTIONS: Transaction[] = [
    { id: '1', date: '2024-03-15', description: 'Salary Deposit', amount: 5000, type: 'income', category: 'Salary' },
    { id: '2', date: '2024-03-14', description: 'Grocery Shopping', amount: 150, type: 'expense', category: 'Food' },
    { id: '3', date: '2024-03-12', description: 'Electric Bill', amount: 85, type: 'expense', category: 'Utilities' },
    { id: '4', date: '2024-03-10', description: 'Freelance Work', amount: 1200, type: 'income', category: 'Freelance' },
    { id: '5', date: '2024-03-08', description: 'Netflix Subscription', amount: 15, type: 'expense', category: 'Entertainment' },
];

export function TransactionProvider({ children }: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction = {
            ...transaction,
            id: Math.random().toString(36).substr(2, 9),
        };
        setTransactions(prev => [newTransaction, ...prev]);
    };

    const deleteTransaction = (id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const stats = transactions.reduce(
        (acc, curr) => {
            if (curr.type === 'income') {
                acc.income += curr.amount;
                acc.monthlyReturn += curr.amount; // Simplified logic
            } else {
                acc.expenses += curr.amount;
                acc.monthlyReturn -= curr.amount;
            }
            return acc;
        },
        { totalPortfolio: 2550000, monthlyReturn: 0, income: 0, expenses: 0 } // Base portfolio value + changes
    );

    // Adjust total portfolio based on net flow (simplified)
    stats.totalPortfolio += stats.monthlyReturn;

    return (
        <TransactionContext.Provider value={{ transactions, addTransaction, deleteTransaction, stats }}>
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransactions() {
    const context = useContext(TransactionContext);
    if (context === undefined) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
}
