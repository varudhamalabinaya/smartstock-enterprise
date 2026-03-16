import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('MOBILE');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (mobile.length === 10) {
            setStep('OTP');
        } else {
            alert('Please enter a valid 10-digit mobile number');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp !== '123456') { alert('Invalid OTP. Use 123456'); return; }
        setLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobileNumber: mobile })
            });
            const data = await response.json();
            if (response.ok) onLogin(data.userId);
            else alert('Login failed');
        } catch {
            alert('Login error. Is backend running?');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #3C006B 0%, #6a0dad 60%, #FF3269 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>

            {/* Decorative blobs */}
            <div style={{ position: 'fixed', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: '-60px', left: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,50,105,0.15)', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: '400px', background: 'rgba(255,255,255,0.97)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.35)' }}>

                {/* Logo header */}
                <div style={{ padding: '2rem 2rem 1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, #3C006B 0%, #6a0dad 100%)' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '1.75rem' }}>🛒</div>
                    <h1 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>SmartStock</h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>Enterprise-grade quick commerce</p>
                </div>

                <div style={{ padding: '2rem' }}>
                    {step === 'MOBILE' ? (
                        <form onSubmit={handleSendOtp}>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center' }}>Enter your mobile number to continue</p>
                            <div style={{ position: 'relative', marginBottom: '1rem' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#3C006B', fontWeight: 700, fontSize: '0.9rem' }}>+91</span>
                                <input
                                    type="tel"
                                    style={{ width: '100%', paddingLeft: '3.5rem', paddingRight: '1rem', paddingTop: '0.875rem', paddingBottom: '0.875rem', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                    placeholder="99999 99999"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                                    maxLength="10"
                                    onFocus={e => e.target.style.borderColor = '#3C006B'}
                                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                                    required
                                />
                            </div>
                            <button type="submit" style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #3C006B, #6a0dad)', color: '#fff', fontWeight: 700, fontSize: '1rem', border: 'none', borderRadius: '12px', cursor: 'pointer', marginTop: '0.5rem', boxShadow: '0 4px 15px rgba(60,0,107,0.3)', transition: 'transform 0.15s' }}
                                onMouseOver={e => e.target.style.transform = 'translateY(-1px)'}
                                onMouseOut={e => e.target.style.transform = 'translateY(0)'}
                            >
                                Continue →
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp}>
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>Verify OTP</h2>
                                <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>Sent to +91 {mobile}</p>
                            </div>
                            <input
                                type="text"
                                style={{ width: '100%', textAlign: 'center', fontSize: '2rem', letterSpacing: '0.5rem', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '12px', outline: 'none', boxSizing: 'border-box', fontWeight: 700, color: '#3C006B' }}
                                placeholder="······"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="6"
                                onFocus={e => e.target.style.borderColor = '#3C006B'}
                                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                                required
                            />
                            <p style={{ color: '#9ca3af', fontSize: '0.75rem', textAlign: 'center', margin: '0.5rem 0 1rem' }}>Use <strong style={{ color: '#3C006B' }}>123456</strong> for testing</p>
                            <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #FF3269, #e0195a)', color: '#fff', fontWeight: 700, fontSize: '1rem', border: 'none', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 15px rgba(255,50,105,0.3)', marginBottom: '0.75rem' }}>
                                {loading ? 'Verifying...' : 'Verify & Login ✓'}
                            </button>
                            <button type="button" onClick={() => setStep('MOBILE')} style={{ width: '100%', background: 'none', border: 'none', color: '#6b7280', fontSize: '0.85rem', cursor: 'pointer', padding: '0.5rem' }}>
                                ← Change Number
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
