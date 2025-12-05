import { useState } from 'react';
import { Plus, Target, Calendar, TrendingUp, Trash2 } from 'lucide-react';
import { useGoals } from '../context/GoalsContext';

export default function Goals() {
    const { goals, addGoal, deleteGoal, updateGoalProgress } = useGoals();
    const [showAddModal, setShowAddModal] = useState(false);
    const [newGoal, setNewGoal] = useState({
        name: '',
        targetAmount: '',
        deadline: '',
        color: 'bg-blue-600'
    });

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        addGoal({
            name: newGoal.name,
            targetAmount: Number(newGoal.targetAmount),
            deadline: newGoal.deadline,
            color: newGoal.color
        });
        setShowAddModal(false);
        setNewGoal({ name: '', targetAmount: '', deadline: '', color: 'bg-blue-600' });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Financial Goals</h1>
                    <p className="text-slate-600">Track your progress towards your dreams</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add Goal
                </button>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New Goal</h2>
                        <form onSubmit={handleAddGoal} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Goal Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    value={newGoal.name}
                                    onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Target Amount</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    value={newGoal.targetAmount}
                                    onChange={e => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    value={newGoal.deadline}
                                    onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Color Theme</label>
                                <select
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    value={newGoal.color}
                                    onChange={e => setNewGoal({ ...newGoal, color: e.target.value })}
                                >
                                    <option value="bg-blue-600">Blue</option>
                                    <option value="bg-purple-600">Purple</option>
                                    <option value="bg-green-600">Green</option>
                                    <option value="bg-orange-600">Orange</option>
                                    <option value="bg-pink-600">Pink</option>
                                </select>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Create Goal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal) => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    return (
                        <div key={goal.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 ${goal.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                                    <Target className={`w-6 h-6 ${goal.color.replace('bg-', 'text-')}`} />
                                </div>
                                <button
                                    onClick={() => deleteGoal(goal.id)}
                                    className="text-slate-400 hover:text-red-500 transition"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-1">{goal.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                                <Calendar className="w-4 h-4" />
                                <span>Target: {new Date(goal.deadline).toLocaleDateString()}</span>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-slate-700">₹{goal.currentAmount.toLocaleString()}</span>
                                    <span className="text-slate-500">of ₹{goal.targetAmount.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className={`h-2.5 rounded-full ${goal.color} transition-all duration-1000`}
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <button
                                onClick={() => updateGoalProgress(goal.id, 5000)}
                                className="w-full py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <TrendingUp className="w-4 h-4" />
                                Add ₹5,000
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
