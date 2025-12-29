import { useState, useEffect } from 'react';
import { campaignAPI } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import { motion } from 'framer-motion'; 
import { Megaphone, Search, Loader2, LayoutGrid } from 'lucide-react'; 

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await campaignAPI.getAll();
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50">
        <Loader2 className="animate-spin text-emerald-600 mb-4" size={48} />
        <p className="text-emerald-800 font-bold tracking-wider italic">Loading active missions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl text-emerald-600 mb-6"
          >
            <Megaphone size={32} />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
          >
            Active <span className="text-emerald-600">Campaigns</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto font-medium"
          >
            Your contribution can provide food, education, and healthcare to those in need. Join our mission today.
          </motion.p>
        </div>

        {/* Search/Filter Bar Hint (UI Only) */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-xs tracking-widest">
            <LayoutGrid size={16} />
            Displaying {campaigns.length} Active Causes
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all shadow-sm text-sm"
            />
          </div>
        </div>

        {/* Campaigns Grid */}
        {campaigns.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-dashed border-emerald-200"
          >
            <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Megaphone className="text-emerald-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No active campaigns</h3>
            <p className="text-gray-500 mt-2">Check back soon for new opportunities to help.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign, index) => (
              <motion.div
                key={campaign._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }} 
                whileHover={{ y: -10 }} 
                className="h-full"
              >
                <CampaignCard campaign={campaign} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

     
      <div className="mt-24 text-center border-t border-gray-100 pt-12">
        <p className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-4">Our Commitment</p>
        <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
          <span className="font-black text-xl text-gray-800 italic underline decoration-emerald-500 underline-offset-4">100% Transparent</span>
          <span className="font-black text-xl text-gray-800 italic underline decoration-emerald-500 underline-offset-4">Verified Causes</span>
          <span className="font-black text-xl text-gray-800 italic underline decoration-emerald-500 underline-offset-4">Secure Giving</span>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;