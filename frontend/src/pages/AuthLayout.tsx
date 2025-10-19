import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import Icon from '../components/ui/Icon';

const AuthLayout: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if(isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="h-10 w-10" />
            </div>
        );
    }

    if(isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Icon name="bot" className="w-8 h-8 text-white"/>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white">ChatterBox</h1>
            </div>
            <div className="w-full max-w-md p-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl shadow-black/20">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;