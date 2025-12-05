import { createContext, useContext, useState, ReactNode } from 'react';

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    color: string;
}

interface GoalsContextType {
    goals: Goal[];
    addGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
    updateGoalProgress: (id: string, amount: number) => void;
    deleteGoal: (id: string) => void;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

const MOCK_GOALS: Goal[] = [
    { id: '1', name: 'Emergency Fund', targetAmount: 100000, currentAmount: 45000, deadline: '2024-12-31', color: 'bg-blue-600' },
    { id: '2', name: 'New Car', targetAmount: 800000, currentAmount: 150000, deadline: '2025-06-30', color: 'bg-purple-600' },
    { id: '3', name: 'Europe Trip', targetAmount: 300000, currentAmount: 50000, deadline: '2024-09-15', color: 'bg-green-600' },
];

export function GoalsProvider({ children }: { children: ReactNode }) {
    const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);

    const addGoal = (goal: Omit<Goal, 'id' | 'currentAmount'>) => {
        const newGoal = {
            ...goal,
            id: Math.random().toString(36).substr(2, 9),
            currentAmount: 0,
        };
        setGoals(prev => [...prev, newGoal]);
    };

    const updateGoalProgress = (id: string, amount: number) => {
        setGoals(prev => prev.map(goal =>
            goal.id === id ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) } : goal
        ));
    };

    const deleteGoal = (id: string) => {
        setGoals(prev => prev.filter(g => g.id !== id));
    };

    return (
        <GoalsContext.Provider value={{ goals, addGoal, updateGoalProgress, deleteGoal }}>
            {children}
        </GoalsContext.Provider>
    );
}

export function useGoals() {
    const context = useContext(GoalsContext);
    if (context === undefined) {
        throw new Error('useGoals must be used within a GoalsProvider');
    }
    return context;
}
