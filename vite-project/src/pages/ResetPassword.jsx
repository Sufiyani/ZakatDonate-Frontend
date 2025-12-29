import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { Lock, CheckCircle2, Loader2, KeyRound, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Redirect if no email is found in navigation state
  if (!email) {
    setTimeout(() => navigate('/forgot-password'), 0);
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Resetting password...');

    try {
      await authAPI.resetPassword({
        email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });

      toast.success('Password reset successful!', { id: toastId });
      
      // Navigate to login after success
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successful. Please login.' } });
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to reset password';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center py-12 px-4">
      <Toaster position="top-center" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100"
      >
        {/* Header Section */}
        <div className="bg-emerald-600 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          
          <motion.div 
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/30"
          >
            <KeyRound size={30} />
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tight">Reset Password</h2>
          <p className="text-emerald-100 mt-1">For: <span className="font-semibold">{email}</span></p>
        </div>

        <div className="p-8">
          {/* Back Navigation */}
          <Link 
            to="/forgot-password" 
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to email</span>
          </Link>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* OTP Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">6-Digit OTP Code</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
                maxLength={6}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-center text-2xl tracking-widest font-bold text-emerald-700"
                placeholder="000000"
              />
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">New Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">Confirm New Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#047857' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-100 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Reset Password</span>
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-gray-500 mt-8 text-sm">
            Didn't receive a code?{' '}
            <button 
              onClick={() => navigate('/forgot-password')}
              className="text-emerald-600 font-bold hover:underline"
            >
              Try again
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;