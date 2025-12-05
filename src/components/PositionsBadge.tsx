import React from 'react';
import { X } from 'lucide-react';

interface PositionsBadgeProps {
    quantity: number;
    pnl: number;
    type: 'BUY' | 'SELL';
    onClose?: () => void;
}

export default function PositionsBadge({ quantity, pnl, type, onClose }: PositionsBadgeProps) {
    const isProfitable = pnl >= 0;

    return (
        <div className={`
            flex items-center gap-2 px-2 py-1 rounded-md border shadow-sm
            ${isProfitable
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }
        `}>
            <div className="flex flex-col items-end">
                <div className="flex items-center gap-1">
                    <span className={`text-[10px] font-bold ${type === 'BUY' ? 'text-blue-600' : 'text-orange-600'}`}>
                        {type} {Math.abs(quantity)}
                    </span>
                </div>
                <span className={`text-[10px] font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                    {isProfitable ? '+' : ''}{pnl.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                </span>
            </div>

            {onClose && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition text-slate-500 hover:text-red-500"
                    title="Close Position"
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </div>
    );
}
