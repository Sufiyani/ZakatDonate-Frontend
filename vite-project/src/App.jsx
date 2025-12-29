import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
 import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Campaigns from './pages/Campaigns';
import DonateForm from './pages/DonateForm';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
           <Route
            path="/donate/:campaignId"
            element={
              <ProtectedRoute>
                <DonateForm />
              </ProtectedRoute>
            }
          />
          
           <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          
           <Route
             path="/admin"
             element={
               <ProtectedRoute adminOnly={true}>
                 <AdminDashboard />
               </ProtectedRoute>
             }
           />
         </Routes>
       </div>
     </Router>
   );
 }

 function App() {
   return (
     <AuthProvider>
       <AppContent />
     </AuthProvider>
   );
 }

export default App; 
