import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  Menu, 
  X, 
  User, 
  LayoutDashboard, 
  Megaphone, 
  HeartHandshake,
  ShieldCheck 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const navLinks = user ? [
    { name: 'Campaigns', path: '/campaigns', icon: Megaphone },
    { 
      name: isAdmin ? 'Admin Panel' : 'My Dashboard', 
      path: isAdmin ? '/admin' : '/dashboard', 
      icon: isAdmin ? ShieldCheck : LayoutDashboard 
    },
  ] : [
    { name: 'Login', path: '/login', icon: null },
  ];

  return (
    <nav className="bg-emerald-700 sticky top-0 z-50 shadow-xl border-b border-emerald-600/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-white p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <HeartHandshake className="text-emerald-700" size={24} />
            </div>
            <span className="text-white text-xl font-black tracking-tight uppercase">
              Saylani <span className="text-emerald-300">Zakat</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-emerald-50 hover:text-white font-bold flex items-center gap-2 transition-all px-3 py-2 rounded-xl hover:bg-white/10"
              >
                {link.icon && <link.icon size={18} />}
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-emerald-600/50">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-800/50 rounded-2xl border border-emerald-500/30">
                  <User size={16} className="text-emerald-300" />
                  <span className="text-white text-sm font-bold">
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-white text-emerald-700 px-5 py-2.5 rounded-xl font-black text-sm hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20"
                >
                  <LogOut size={16} />
                  Logout
                </motion.button>
              </div>
            ) : (
              <Link
                to="/register"
                className="bg-emerald-400 text-emerald-900 px-6 py-2.5 rounded-xl font-black hover:bg-white transition-all shadow-lg"
              >
                Register
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 rounded-xl bg-emerald-800/50"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="md:hidden absolute top-20 right-0 w-full bg-emerald-800 border-t border-emerald-700 p-6 space-y-4 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-white text-lg font-bold p-4 rounded-2xl bg-emerald-700/50"
              >
                {link.icon && <link.icon size={20} />}
                {link.name}
              </Link>
            ))}

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 bg-red-500 text-white p-4 rounded-2xl font-black text-lg"
              >
                <LogOut size={20} /> Logout
              </button>
            ) : (
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block text-center bg-emerald-400 text-emerald-900 p-4 rounded-2xl font-black text-lg"
              >
                Register Now
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;