import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion'; 
import { 
  Heart, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Globe 
} from 'lucide-react'; 

const Home = () => {
  const { user } = useContext(AuthContext);

 
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative bg-emerald-700 py-24 md:py-32 overflow-hidden">
        {/* Decorative Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div {...fadeIn}>
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-emerald-100 uppercase bg-emerald-800/50 rounded-full backdrop-blur-sm border border-emerald-500/30">
              Trusted Charity Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-white leading-tight">
              Donation & <span className="text-emerald-400">Zakat</span> <br />
              Management System
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-emerald-50 max-w-3xl mx-auto font-medium opacity-90">
              Empowering the Ummah through transparent giving. Make a lasting difference with every contribution.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              {user ? (
                <>
                  <Link
                    to="/campaigns"
                    className="group bg-white text-emerald-700 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-xl flex items-center gap-2"
                  >
                    View Campaigns <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/donate/general"
                    className="bg-emerald-800/40 backdrop-blur-md border-2 border-emerald-400/50 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-lg"
                  >
                    Donate Now
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group bg-white text-emerald-700 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-xl flex items-center gap-2"
                  >
                    Get Started <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="bg-emerald-800/40 backdrop-blur-md border-2 border-emerald-400/50 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-lg"
                  >
                    Sign In to Portal
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Heart className="text-emerald-600" size={32} />, 
              title: "Multiple Types", 
              desc: "Support through Zakat, Sadqah, Fitra, or General donations",
              color: "emerald"
            },
            { 
              icon: <ShieldCheck className="text-blue-600" size={32} />, 
              title: "Full Transparency", 
              desc: "Track your donations with detailed receipts and status updates",
              color: "blue"
            },
            { 
              icon: <Zap className="text-amber-500" size={32} />, 
              title: "Campaign Support", 
              desc: "Contribute to specific causes that matter to you",
              color: "amber"
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-emerald-50 group hover:border-emerald-200 transition-all"
            >
              <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed font-medium">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="max-w-5xl mx-auto px-4 py-24">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Our System?</h2>
          <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full" />
        </motion.div>

        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-emerald-900/10 border border-emerald-50 relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Globe size={200} className="text-emerald-900" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {[
              "Instant PDF receipt generation",
              "Secure authentication & data protection",
              "Admin verification system",
              "Multiple payment methods",
              "Real-time campaign tracking",
              "Automated Zakat calculation"
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 group"
              >
                <div className="bg-emerald-100 p-2 rounded-full group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <CheckCircle2 size={20} className="text-emerald-600 group-hover:text-white" />
                </div>
                <span className="text-lg font-bold text-gray-700">{item}</span>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-emerald-200 flex items-center justify-center text-[10px] font-bold">
                    <Users size={16} className="text-emerald-700" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Join 500+ Donors</p>
            </div>
            <p className="text-emerald-600 font-black text-xl italic">"The best of people are those that bring most benefit to the rest of mankind."</p>
          </div>
        </div>
      </div>
    
      <footer className="py-12 bg-emerald-900 text-center text-emerald-200">
        <p className="font-medium tracking-widest uppercase text-xs">© 2025 Saylani Zakat Management System • Helping Lives Together</p>
      </footer>
    </div>
  );
};

export default Home;