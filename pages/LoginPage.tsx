import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { RegistrationData } from '../types';

const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-blue-600" fill="currentColor" viewBox="0 0 100 100">
        <rect x="10" y="20" width="80" height="15"></rect>
        <rect x="20" y="40" width="15" height="40"></rect>
        <rect x="42.5" y="40" width="15" height="40"></rect>
        <rect x="65" y="40" width="15" height="40"></rect>
    </svg>
);

const AlertTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 flex-shrink-0">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);


export const LoginPage: React.FC = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const { login, register, isLoading, error, clearError } = useAuth();

    useEffect(() => {
        clearError();
    }, [isRegistering, clearError]);
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
    const [caseType, setCaseType] = useState<'Cardiology' | 'Orthopedics' | 'General' | 'Neurology'>('General');

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        await login(username, password);
    };

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        const registrationData: RegistrationData = {
            name,
            username,
            password,
            age: parseInt(age, 10),
            gender,
            caseType
        };
        await register(registrationData);
    };
    
    const formContainerClasses = "w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg";
    const inputClasses = "w-full px-4 py-2 text-slate-700 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
    const buttonClasses = "w-full py-3 px-4 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors";
    const toggleFormClasses = "text-sm text-center text-blue-600 hover:underline cursor-pointer mt-4";
    const labelClasses = "text-sm font-medium text-slate-600 block mb-1";

    const ErrorDisplay = () => {
        if (!error) return null;
        return (
            <div className="flex items-center p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded-md" role="alert">
                <AlertTriangleIcon />
                <span>{error}</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
            {isRegistering ? (
                <div className={formContainerClasses}>
                    <h2 className="text-2xl font-bold text-center text-slate-800">Create Patient Account</h2>
                    <form onSubmit={handleRegister} className="space-y-4">
                         <div>
                            <label className={labelClasses}>Full Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClasses} required />
                        </div>
                         <div>
                            <label className={labelClasses}>Username</label>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className={inputClasses} required />
                        </div>
                         <div>
                            <label className={labelClasses}>Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputClasses} required />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className={labelClasses}>Age</label>
                                <input type="number" value={age} onChange={e => setAge(e.target.value)} className={inputClasses} required min="0" />
                            </div>
                            <div className="flex-1">
                                <label className={labelClasses}>Gender</label>
                                <select value={gender} onChange={e => setGender(e.target.value as any)} className={inputClasses}>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className={labelClasses}>Case Type</label>
                            <select value={caseType} onChange={e => setCaseType(e.target.value as any)} className={inputClasses}>
                                <option>General</option>
                                <option>Cardiology</option>
                                <option>Orthopedics</option>
                                <option>Neurology</option>
                            </select>
                        </div>

                        <ErrorDisplay />

                        <button type="submit" className={buttonClasses} disabled={isLoading}>
                            {isLoading ? 'Registering...' : 'Sign Up'}
                        </button>
                    </form>
                    <p onClick={() => setIsRegistering(false)} className={toggleFormClasses}>
                        Already have an account? Sign In
                    </p>
                </div>
            ) : (
                <div className={formContainerClasses}>
                    <div className="text-center mb-6">
                        <BuildingIcon />
                        <h2 className="text-3xl font-bold text-slate-800 mt-4">Al Safaa Hospital Portal</h2>
                        <p className="text-slate-500 mt-1">Sign in to access your dashboard</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input type="text" placeholder="Username (e.g., jdoe, ereed, swilson)" value={username} onChange={e => setUsername(e.target.value)} className={inputClasses} required />
                        </div>
                        <div>
                            <input type="password" placeholder="Password (e.g., password123)" value={password} onChange={e => setPassword(e.target.value)} className={inputClasses} required />
                        </div>

                        <ErrorDisplay />
                        
                        <button type="submit" className={buttonClasses} disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign in'}
                        </button>
                    </form>
                    <p onClick={() => setIsRegistering(true)} className={toggleFormClasses}>
                        Don't have an account? Register here
                    </p>
                </div>
            )}
        </div>
    );
};