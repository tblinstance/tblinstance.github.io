import React, { useState } from 'react';
import { useAppStore } from '../../store/AppStore';
import type { AppState } from '../../store/types';
import { useGeoLocation } from '@bigdatacloudapi/react-reverse-geocode-client';
import { ActivateCheckEmailView } from './ActivateCheckEmailView';

export function SignupView() {
  const { loading, register, setIsLogin, setShowAuth, isMobile, showAlert } = useAppStore() as AppState;
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');

  const { data: geoData, refresh: detectLocation } = useGeoLocation();

  React.useEffect(() => {
    if (geoData) {
      if (geoData.countryName) setCountry(geoData.countryName);
      
      const parts = [];
      if (geoData.locality) parts.push(geoData.locality);
      if (geoData.city && geoData.city !== geoData.locality) parts.push(geoData.city);
      if (geoData.principalSubdivision) parts.push(geoData.principalSubdivision);
      if (geoData.postcode) parts.push(geoData.postcode);
      
      if (parts.length > 0) {
        setAddress(parts.join(', '));
      } else if (geoData.city) {
        setAddress(geoData.city);
      }
    }
  }, [geoData]);

  const handleDetectAddress = () => {
    detectLocation();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showAlert('Error', 'Passwords do not match!');
      return;
    }
    await register(email, password, firstName, lastName, phoneNumber, address, country);
    // Show email verification view after successful registration
    setRegisteredEmail(email);
    setRegistrationSuccess(true);
  };

  // Show email verification view after successful registration
  if (registrationSuccess) {
    return (
      <ActivateCheckEmailView
        email={registeredEmail}
        onBackToLogin={() => {
          setRegistrationSuccess(false);
          setIsLogin(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex bg-[var(--bg)] font-['Outfit'] animate-fade-in">
      {/* Left Side: Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-[var(--primary)] mb-2 tracking-tighter">TBLINC</h1>
            <p className="text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] text-xs">Cloud Infrastructure</p>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-[var(--text-main)] mb-2 tracking-tight">Create your account</h2>
            <p className="text-[var(--text-muted)] font-medium mb-2">Join the next generation of cloud computing.</p>
            <p className="font-bangla text-[var(--primary)] font-bold text-sm">নতুন অ্যাকাউন্ট তৈরি করুন — ক্লাউড কম্পিউটিংয়ের নতুন যুগে যোগ দিন।</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">First Name</label>
                <input 
                  type="text" 
                  value={firstName} 
                  onChange={e => setFirstName(e.target.value)} 
                  required 
                  placeholder="John"
                  autoComplete="given-name"
                  className="input py-4 text-base" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Last Name</label>
                <input 
                  type="text" 
                  value={lastName} 
                  onChange={e => setLastName(e.target.value)} 
                  required 
                  placeholder="Doe"
                  autoComplete="family-name"
                  className="input py-4 text-base" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                placeholder="name@company.com"
                autoComplete="email"
                className="input py-4 text-base" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Phone Number</label>
              <input 
                type="tel" 
                value={phoneNumber} 
                onChange={e => setPhoneNumber(e.target.value)} 
                required 
                placeholder="+1 234 567 8900"
                autoComplete="tel"
                className="input py-4 text-base" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Full Address</label>
                <button 
                  type="button"
                  onClick={handleDetectAddress}
                  className="text-[0.65rem] font-bold text-[var(--primary)] hover:underline uppercase tracking-wider"
                >
                  <span className="icon text-[0.8rem] align-middle mr-1">my_location</span>
                  Detect Exact
                </button>
              </div>
              <input 
                type="text" 
                value={address} 
                onChange={e => setAddress(e.target.value)} 
                required 
                placeholder="123 Cloud Street, City, ZIP"
                autoComplete="street-address"
                className="input py-4 text-base" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Country</label>
              <input 
                type="text" 
                value={country} 
                onChange={e => setCountry(e.target.value)} 
                required 
                placeholder="United States"
                autoComplete="country-name"
                className="input py-4 text-base" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Password</label>
              <div className="relative group">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className="input py-4 text-base pr-12" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                >
                  <span className="icon">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Confirm Password</label>
              <div className="relative group">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  required 
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className="input py-4 text-base pr-12" 
                />
              </div>
            </div>
            
            <button 
              disabled={loading} 
              type="submit" 
              className="w-full btn btn-primary py-4 text-lg shadow-xl shadow-[var(--primary-transparent)] mt-4"
            >
              {loading ? (
                <><span className="icon animate-spin">refresh</span> Creating account...</>
              ) : (
                'Start Building Free'
              )}
            </button>
          </form>

          <div className="text-center mt-10 space-y-6">
            <p className="text-[var(--text-muted)] font-medium">
              Already have an account? 
              <button 
                onClick={() => setIsLogin(true)} 
                className="text-[var(--primary)] font-black ml-2 hover:underline decoration-2 underline-offset-4"
              >
                Sign In
              </button>
            </p>
            
            <div className="pt-6 border-t border-[var(--border)]">
              <button 
                onClick={() => setShowAuth(false)} 
                className="btn btn-ghost text-sm py-2 px-4 group"
              >
                <span className="icon group-hover:-translate-x-1 transition-transform">arrow_back</span>
                Back to website
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Visual */}
      {!isMobile && (
        <div className="flex-1 relative overflow-hidden bg-[var(--surface)] border-l border-[var(--border)]">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/analytics_bg.webp" 
              alt="Global Network" 
              className="w-full h-full object-cover opacity-20 mix-blend-screen grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100" 
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface)] via-transparent to-[var(--primary-transparent)] opacity-90" />
          </div>

          {/* Floating Accents */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--primary)] blur-[150px] opacity-10 rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-500 blur-[150px] opacity-10 rounded-full" />
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-16 text-center">
            <div className="card p-12 max-w-lg glass shadow-2xl animate-scale-in">
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary-transparent)] border border-[var(--primary-transparent-border)] flex items-center justify-center mb-8 mx-auto shadow-inner">
                <span className="icon text-3xl text-[var(--primary)]">rocket_launch</span>
              </div>
              <h3 className="text-4xl font-black text-[var(--text-main)] mb-4 tracking-tight leading-tight">Join the Future.</h3>
              <p className="text-[var(--text-sub)] text-lg font-medium leading-relaxed mb-10">
                Join thousands of developers building scalable applications on our enterprise-grade NVMe cloud infrastructure.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: '99.9% Uptime', icon: 'timer' },
                  { label: 'Global Edge', icon: 'public' },
                  { label: '10Gbps Speed', icon: 'bolt' },
                  { label: 'Free Setup', icon: 'auto_awesome' }
                ].map(feature => (
                  <div key={feature.label} className="flex items-center gap-3 p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl group hover:border-[var(--primary-transparent-border)] transition-all">
                    <span className="icon text-[var(--primary)] text-lg">{feature.icon}</span>
                    <span className="text-sm font-bold text-[var(--text-main)]">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Stats */}
            <div className="absolute bottom-12 w-full px-16 flex justify-between items-center opacity-40 hover:opacity-100 transition-all">
              <div className="text-center">
                <div className="text-2xl font-black text-[var(--text-main)] tracking-tighter">50ms</div>
                <div className="text-[0.6rem] font-bold text-[var(--text-muted)] uppercase tracking-widest">Global Latency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-[var(--text-main)] tracking-tighter">10k+</div>
                <div className="text-[0.6rem] font-bold text-[var(--text-muted)] uppercase tracking-widest">Active Nodes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-[var(--text-main)] tracking-tighter">24/7</div>
                <div className="text-[0.6rem] font-bold text-[var(--text-muted)] uppercase tracking-widest">Expert Support</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
