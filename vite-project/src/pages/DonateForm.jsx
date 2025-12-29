import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { donationAPI, campaignAPI } from '../services/api';
import { generateReceipt } from '../utils/pdfGenerator';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { 
  Heart, 
  CreditCard, 
  Coins, 
  LayoutList, 
  Loader2, 
  CheckCircle2,
  ChevronLeft 
} from 'lucide-react';

const DonateForm = () => {
  const { campaignId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  
  const [campaign, setCampaign] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'Zakat',
    category: 'General',
    paymentMethod: 'Cash'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (campaignId) fetchCampaign();
  }, [campaignId, user, navigate]);

  const fetchCampaign = async () => {
    try {
      const response = await campaignAPI.getById(campaignId);
      setCampaign(response.data);
    } catch (error) {
      toast.error('Failed to load campaign');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Processing your donation...');

    try {
      let stripePaymentId = null;

      if (formData.paymentMethod === 'Online') {
        if (!stripe || !elements) return;
        
        const { data } = await donationAPI.createPaymentIntent({ amount: formData.amount });
        
        const result = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: { card: elements.getElement(CardElement) },
        });

        if (result.error) throw new Error(result.error.message);
        stripePaymentId = result.paymentIntent.id;
      }

      const donationData = {
        ...formData,
        amount: parseFloat(formData.amount),
        campaignId: campaignId || null,
        stripePaymentId: stripePaymentId
      };

      const response = await donationAPI.create(donationData);
      generateReceipt(response.data, user.name);
      
      toast.success('Alhamdulillah! Donation Successful', { id: toastId });
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2500);

    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Donation failed';
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-[2.5rem] shadow-2xl text-center max-w-sm w-full border border-emerald-100"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-emerald-600" size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">JazakAllah!</h2>
          <p className="text-emerald-700 font-medium mb-2">Donation Successful</p>
          <p className="text-gray-500 text-sm">
            Your receipt has been downloaded automatically. Redirecting to your dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 py-12 px-4 selection:bg-emerald-200">
      <Toaster position="top-center" />
      <div className="max-w-xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-emerald-700 font-bold mb-6 hover:text-emerald-800 transition-all"
        >
          <ChevronLeft size={20} /> Back
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 overflow-hidden border border-emerald-100"
        >
          <div className="bg-emerald-600 p-8 text-center text-white relative">
            <Heart className="absolute top-4 right-4 text-white/20" size={60} />
            <h2 className="text-3xl font-extrabold mb-1">Make a Donation</h2>
            <p className="text-emerald-100 opacity-90">Your contribution changes lives</p>
          </div>

          <div className="p-8 md:p-10">
            {campaign && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl mb-8 flex items-center gap-4"
              >
                <div className="bg-emerald-600 p-3 rounded-xl text-white">
                  <Coins size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Contributing to:</p>
                  <p className="text-lg font-bold text-emerald-900">{campaign.title}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Donation Amount (PKR)</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-emerald-600">PKR</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-lg font-bold"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Donation Type</label>
                  <div className="relative">
                    <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none appearance-none cursor-pointer font-medium"
                    >
                      <option value="Zakat">Zakat</option>
                      <option value="Sadqah">Sadqah</option>
                      <option value="Fitra">Fitra</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Category</label>
                  <div className="relative">
                    <LayoutList className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none appearance-none cursor-pointer font-medium"
                    >
                      <option value="Food">Food</option>
                      <option value="Education">Education</option>
                      <option value="Medical">Medical</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Payment Method</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none appearance-none cursor-pointer font-medium"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank Transfer</option>
                    <option value="Online">Online Payment (Stripe)</option>
                  </select>
                </div>
              </div>

              {formData.paymentMethod === 'Online' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 border-2 border-emerald-100 rounded-2xl bg-emerald-50/30"
                >
                  <label className="text-xs font-bold text-emerald-700 mb-2 block">CARD DETAILS</label>
                  <div className="bg-white p-3 rounded-xl border border-gray-200">
                    <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
                  </div>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#047857' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-xl shadow-xl shadow-emerald-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 mt-4"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <span>Complete Donation</span>
                    <Heart size={20} fill="currentColor" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
          <div className="h-2 bg-gradient-to-r from-emerald-600 via-yellow-400 to-emerald-600" />
        </motion.div>
        
        <p className="text-center text-emerald-800/50 text-xs mt-8 font-bold tracking-widest uppercase italic">
          May Allah accept your kindness and bless you.
        </p>
      </div>
    </div>
  );
};

export default DonateForm;