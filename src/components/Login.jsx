import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { login } from '../api/authApi';

/**
 * Login Component
 *
 * Rendered at the `/login` route.
 * Presents a login modal card asking for username and password.
 * Includes password recovery contact info and handles redirection to Dashboard upon successful authentication.
 */
export default function Login({ onLoginSuccess, onNavigateHome }) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles login form submission against the real backend authentication endpoint.
   */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setErrorMessage(t('login.errorEmpty', 'Please enter both username and password.'));
      return;
    }

    setIsSubmitting(true);

    try {
      const { token } = await login(username.trim(), password);
      setIsSubmitting(false);
      onLoginSuccess({ username: username.trim(), token });
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(t('login.errorInvalid', 'Invalid username or password. Please try again.'));
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4 sm:p-6 animate-fade-slide-in">
      {/* LOGIN MODAL CARD */}
      <div className="bg-white rounded-3xl max-w-[460px] w-full p-8 sm:p-10 border border-[#F0E8DF] shadow-2xl relative animate-modal-slide-up text-[#3D3229]">
        {/* Header / Brand Icon */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#C2784A] rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-3 shadow-md">
            <i className="fa-solid fa-lock"></i>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C2784A] block mb-1">
            {t('login.badge', 'Staff Portal')}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#3D3229] tracking-tight">
            {t('login.title', 'Dashboard Login')}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5D51] mt-1.5">
            {t('login.subtitle', 'Enter your credentials to access the management panel')}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-[#FFF2F0] border border-[#FFCCC7] rounded-xl text-xs sm:text-sm text-[#CF1322] flex items-center gap-2.5">
            <i className="fa-solid fa-circle-exclamation shrink-0"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-1.5">
              {t('login.username', 'Username')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A89885]">
                <i className="fa-regular fa-user text-sm"></i>
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('login.usernamePlaceholder', 'Enter username (e.g. admin)')}
                autoComplete="username"
                required
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border-2 border-[#F0E8DF] rounded-xl text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#C2784A] focus:bg-[#FDFAF6] transition-all text-[#3D3229]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-1.5">
              {t('login.password', 'Password')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A89885]">
                <i className="fa-solid fa-key text-sm"></i>
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('login.passwordPlaceholder', 'Enter password')}
                autoComplete="current-password"
                required
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border-2 border-[#F0E8DF] rounded-xl text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#C2784A] focus:bg-[#FDFAF6] transition-all text-[#3D3229]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#C2784A] hover:bg-[#A85D32] text-white font-semibold text-sm rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin text-sm"></i>
                <span>{t('login.signingIn', 'Signing in...')}</span>
              </>
            ) : (
              <>
                <span>{t('login.signIn', 'Sign In')}</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </>
            )}
          </button>
        </form>

        {/* Forgot Password Recovery Notice */}
        <div className="mt-6 pt-5 border-t border-[#F0E8DF] text-center">
          <p className="text-xs text-[#6B5D51] leading-relaxed">
            {t('login.forgotPassword', 'Contact us in case of forgetting your password:')}{' '}
            <a
              href="tel:+15035550147"
              className="font-semibold text-[#C2784A] hover:underline whitespace-nowrap block sm:inline mt-0.5 sm:mt-0"
            >
              +1 (503) 555-0147
            </a>
          </p>
        </div>

        {/* Optional back to site button */}
        {onNavigateHome && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-xs text-[#A89885] hover:text-[#3D3229] transition-colors cursor-pointer"
            >
              {t('login.backToSite', '← Back to Main Site')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
