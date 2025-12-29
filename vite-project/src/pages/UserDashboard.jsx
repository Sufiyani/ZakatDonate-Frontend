import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { donationAPI } from '../services/api';
import { generateReceipt } from '../utils/pdfGenerator';
import { motion } from 'framer-motion'; 
import { 
  Wallet, 
  History, 
  Download, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Loader2 
} from 'lucide-react'; 

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, count: 0 });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await donationAPI.getUserDonations();
      setDonations(response.data);
      
      const total = response.data.reduce((sum, d) => sum + d.amount, 0);
      setStats({ total, count: response.data.length });
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = (donation) => {
    generateReceipt(donation, user.name);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50">
        <Loader2 className="animate-spin text-emerald-600 mb-4" size={48} />
        <div className="text-xl font-medium text-emerald-800 italic">Preparing your portal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            My <span className="text-emerald-600">Dashboard</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Assalam-o-Alaikum, {user?.name || 'Brother/Sister'}</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: 'Total Donations', value: stats.count, icon: History, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Amount', value: `PKR ${stats.total.toLocaleString()}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Account Status', value: 'Active', icon: CheckCircle, color: 'text-amber-600', bg: 'bg-amber-50' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center space-x-5"
            >
              <div className={`${stat.bg} p-4 rounded-2xl`}>
                <stat.icon className={stat.color} size={28} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</h3>
                <p className={`text-2xl font-black ${stat.color === 'text-emerald-600' ? 'text-emerald-700' : 'text-gray-800'}`}>
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Donation History Table */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-50"
        >
          <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="text-emerald-500" />
              Donation History
            </h2>
          </div>

          {donations.length === 0 ? (
            <div className="p-20 text-center">
              <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="text-emerald-300" size={40} />
              </div>
              <p className="text-gray-500 font-medium text-lg">No donations yet. Start making a difference today!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-widest font-bold">
                    <th className="px-8 py-5 text-left">Date</th>
                    <th className="px-8 py-5 text-left">Transaction ID</th>
                    <th className="px-8 py-5 text-left">Type</th>
                    <th className="px-8 py-5 text-left">Amount</th>
                    <th className="px-8 py-5 text-left">Status</th>
                    <th className="px-8 py-5 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {donations.map((donation, idx) => (
                    <motion.tr 
                      key={donation._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-emerald-50/30 transition-colors group"
                    >
                      <td className="px-8 py-5 whitespace-nowrap text-sm font-semibold text-gray-700">
                        {new Date(donation.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500 font-mono">
                        #{donation.transactionId}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                          {donation.type}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm font-black text-emerald-700">
                        PKR {donation.amount.toLocaleString()}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          donation.status === 'Verified'
                            ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
                            : 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
                        }`}>
                          {donation.status === 'Verified' ? <CheckCircle size={14} /> : <Clock size={14} />}
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDownloadReceipt(donation)}
                          className="p-2 bg-white border border-gray-200 rounded-xl text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm"
                          title="Download PDF Receipt"
                        >
                          <Download size={18} />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;