import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/AppStore';

const UserActivationView: React.FC = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();
  const { activateAccount } = useAppStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const activate = async () => {
      if (uid && token) {
        const res = await activateAccount(uid, token);
        if (res.success) {
          setStatus('success');
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          setStatus('error');
        }
      }
    };
    activate();
  }, [uid, token, activateAccount, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="mb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Account Verification</h2>
        </div>

        {status === 'loading' && (
          <div className="py-8">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Verifying your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4 border border-green-500/20">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-300 mb-6 text-lg">Your account has been successfully verified!</p>
            <p className="text-sm text-gray-500">Redirecting to homepage...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="py-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-400 mb-6">Verification failed. The link may be expired or invalid.</p>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all border border-gray-700 font-medium"
            >
              Return to Homepage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivationView;
