import { useState, useEffect } from 'react';
import { donationAPI, campaignAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { 
  LayoutDashboard, 
  HandHeart, 
  Megaphone, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit3, 
  Loader2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [campaignForm, setCampaignForm] = useState({
    title: '', description: '', goalAmount: '', deadline: ''
  });
  const [editingCampaign, setEditingCampaign] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [donationsRes, campaignsRes, statsRes] = await Promise.all([
        donationAPI.getAllDonations(),
        campaignAPI.getAllAdmin(),
        donationAPI.getStats()
      ]);
      setDonations(donationsRes.data);
      setCampaigns(campaignsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to sync data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (donationId, newStatus) => {
    const toastId = toast.loading('Updating status...');
    try {
      await donationAPI.updateStatus(donationId, newStatus);
      toast.success('Donation Verified!', { id: toastId });
      fetchData();
    } catch (error) {
      toast.error('Update failed', { id: toastId });
    }
  };

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Saving campaign...');
    try {
      if (editingCampaign) {
        await campaignAPI.update(editingCampaign._id, campaignForm);
        setEditingCampaign(null);
        toast.success('Campaign Updated!', { id: toastId });
      } else {
        await campaignAPI.create(campaignForm);
        toast.success('Campaign Created!', { id: toastId });
      }
      setCampaignForm({ title: '', description: '', goalAmount: '', deadline: '' });
      fetchData();
    } catch (error) {
      toast.error('Save failed', { id: toastId });
    }
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setCampaignForm({
      title: campaign.title,
      description: campaign.description,
      goalAmount: campaign.goalAmount,
      deadline: new Date(campaign.deadline).toISOString().split('T')[0]
    });
    setActiveTab('campaigns');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCampaign = async (id) => {
    if (window.confirm('Delete this campaign forever?')) {
      try {
        await campaignAPI.delete(id);
        toast.success('Deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50">
        <Loader2 className="animate-spin text-emerald-600 mb-4" size={50} />
        <h2 className="text-emerald-800 font-bold tracking-widest uppercase text-sm">Initializing Command Center</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Admin <span className="text-emerald-600">Portal</span></h1>
            <p className="text-gray-500 font-medium">Manage Zakat, Donations and Campaigns</p>
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
              { id: 'donations', icon: HandHeart, label: 'Donations' },
              { id: 'campaigns', icon: Megaphone, label: 'Campaigns' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                  activeTab === tab.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-gray-400 hover:text-emerald-600'
                }`}
              >
                <tab.icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Donations', val: stats.totalDonations, color: 'emerald', icon: HandHeart },
                    { label: 'Total Revenue', val: `PKR ${stats.totalAmount?.toLocaleString()}`, color: 'blue', icon: TrendingUp },
                    { label: 'Verified Funds', val: `PKR ${stats.verifiedAmount?.toLocaleString()}`, color: 'green', icon: CheckCircle2 },
                    { label: 'Pending Verification', val: `PKR ${stats.pendingAmount?.toLocaleString()}`, color: 'amber', icon: AlertCircle }
                  ].map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
                      <div className={`p-4 rounded-2xl bg-${s.color}-50 text-${s.color}-600`}>
                        <s.icon size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                        <p className="text-xl font-black text-gray-800">{s.val}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-50">
                  <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
                    <button onClick={() => setActiveTab('donations')} className="text-emerald-600 font-bold text-sm hover:underline">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                        <tr>
                          <th className="px-8 py-4">Donor</th>
                          <th className="px-8 py-4">Amount</th>
                          <th className="px-8 py-4">Type</th>
                          <th className="px-8 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {donations.slice(0, 6).map((d) => (
                          <tr key={d._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-8 py-4 font-bold text-gray-700">{d.user?.name}</td>
                            <td className="px-8 py-4 font-black text-emerald-700">PKR {d.amount.toLocaleString()}</td>
                            <td className="px-8 py-4 text-sm text-gray-500 font-medium">{d.type}</td>
                            <td className="px-8 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                d.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {d.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* DONATIONS TAB */}
            {activeTab === 'donations' && (
              <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-50">
                <div className="px-8 py-6 bg-emerald-600 text-white">
                  <h2 className="text-2xl font-bold">Transaction Ledger</h2>
                  <p className="text-emerald-100 text-sm opacity-80">Verify and monitor all incoming funds</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest">
                      <tr>
                        <th className="px-8 py-5">Date</th>
                        <th className="px-8 py-5">Donor Info</th>
                        <th className="px-8 py-5">Amount</th>
                        <th className="px-8 py-5">Method</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {donations.map((d) => (
                        <tr key={d._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-5 text-sm font-medium text-gray-500">
                            {new Date(d.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-8 py-5">
                            <p className="font-bold text-gray-800">{d.user?.name}</p>
                            <p className="text-xs text-gray-400">{d.user?.email}</p>
                          </td>
                          <td className="px-8 py-5 font-black text-emerald-700">PKR {d.amount.toLocaleString()}</td>
                          <td className="px-8 py-5 text-xs font-bold text-gray-500">{d.paymentMethod}</td>
                          <td className="px-8 py-5">
                            <span className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-tighter ${
                              d.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {d.status}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            {d.status === 'Pending' && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleStatusUpdate(d._id, 'Verified')}
                                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-100"
                              >
                                Verify Now
                              </motion.button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CAMPAIGNS TAB */}
            {activeTab === 'campaigns' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form Column */}
                <div className="lg:col-span-5">
                  <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-gray-50 sticky top-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <PlusCircle size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {editingCampaign ? 'Update Mission' : 'New Mission'}
                      </h2>
                    </div>
                    <form onSubmit={handleCampaignSubmit} className="space-y-5">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Title</label>
                        <input
                          type="text"
                          value={campaignForm.title}
                          onChange={(e) => setCampaignForm({...campaignForm, title: e.target.value})}
                          required
                          className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium"
                          placeholder="e.g., Flood Relief 2025"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea
                          value={campaignForm.description}
                          onChange={(e) => setCampaignForm({...campaignForm, description: e.target.value})}
                          required
                          rows="4"
                          className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium"
                          placeholder="Details of the cause..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Goal (PKR)</label>
                          <input
                            type="number"
                            value={campaignForm.goalAmount}
                            onChange={(e) => setCampaignForm({...campaignForm, goalAmount: e.target.value})}
                            required
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Deadline</label>
                          <input
                            type="date"
                            value={campaignForm.deadline}
                            onChange={(e) => setCampaignForm({...campaignForm, deadline: e.target.value})}
                            required
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200"
                        >
                          {editingCampaign ? 'Save Changes' : 'Launch Campaign'}
                        </motion.button>
                        {editingCampaign && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCampaign(null);
                              setCampaignForm({ title: '', description: '', goalAmount: '', deadline: '' });
                            }}
                            className="px-6 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>

                {/* List Column */}
                <div className="lg:col-span-7 space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 ml-2">Active Mission List</h3>
                  {campaigns.map((c) => (
                    <motion.div 
                      layout
                      key={c._id} 
                      className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-black text-gray-800 group-hover:text-emerald-600 transition-colors leading-tight">
                            {c.title}
                          </h4>
                          <p className="text-gray-500 text-sm mt-2 line-clamp-2 font-medium">{c.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditCampaign(c)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => handleDeleteCampaign(c._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-50">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Goal</p>
                          <p className="font-bold text-gray-700">PKR {c.goalAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Raised</p>
                          <p className="font-bold text-emerald-600">PKR {c.raisedAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ends On</p>
                          <p className="font-bold text-gray-700">{new Date(c.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;