import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Don't show breadcrumbs on home page
    if (pathnames.length === 0) return null;

    const routeNameMap: Record<string, string> = {
        markets: 'World Markets',
        news: 'News Room',
        strategy: 'Strategy Builder',
        community: 'Community',
        analytics: 'Analytics',
        screener: 'Stock Screener',
        goals: 'Financial Goals',
        transactions: 'Transactions',
        settings: 'Settings',
        profile: 'User Profile'
    };

    return (
        <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link
                        to="/"
                        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Home
                    </Link>
                </li>
                {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const name = routeNameMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

                    return (
                        <li key={to}>
                            <div className="flex items-center">
                                <ChevronRight className="w-4 h-4 text-slate-400 mx-1" />
                                {last ? (
                                    <span className="text-sm font-medium text-slate-900">{name}</span>
                                ) : (
                                    <Link
                                        to={to}
                                        className="text-sm font-medium text-slate-500 hover:text-blue-600 transition"
                                    >
                                        {name}
                                    </Link>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
