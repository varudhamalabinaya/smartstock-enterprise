import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('MOBILE'); // MOBILE or OTP

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (mobile.length === 10) {
            setStep('OTP');
        } else {
            alert("Please enter a valid 10-digit mobile number");
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp === '123456') { // Mock OTP
            try {
                const response = await fetch('http://localhost:8080/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mobileNumber: mobile })
                });
                const data = await response.json();
                if (response.ok) {
                    onLogin(data.userId);
                } else {
                    alert("Login failed");
                }
            } catch (err) {
                console.error("Login error", err);
                alert("Login error. Is backend running?");
            }
        } else {
            alert('Invalid OTP. Use 123456');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-primary p-6 text-center">
                    <h1 className="text-3xl font-bold text-white tracking-tight">SmartStock</h1>
                    <p className="text-white/80 mt-1">Enterprise Edition</p>
                </div>

                <div className="p-8">
                    {step === 'MOBILE' ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-500 font-bold">+91</span>
                                    <input
                                        type="tel"
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        placeholder="99999 99999"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} // Only allow digits
                                        maxLength="10"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-purple-200"
                            >
                                Continue
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Verify OTP</h2>
                                <p className="text-sm text-gray-500 mt-1">Sent to +91 {mobile}</p>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    className="w-full text-center text-2xl tracking-widest py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="• • • • • •"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength="6"
                                    required
                                />
                                <p className="text-xs text-center text-gray-400 mt-2">Use 123456 for testing</p>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-secondary hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-pink-200"
                            >
                                Verify & Login
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep('MOBILE')}
                                className="w-full text-gray-500 text-sm hover:underline"
                            >
                                Change Number
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
