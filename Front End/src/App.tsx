import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import AdminLayout from './pages/admin/AdminLayout';
import ResellerLayout from './pages/reseller/ResellerLayout';
import ResellerDashboard from './pages/reseller/ResellerDashboard';
import ResellerVehicles from './pages/reseller/ResellerVehicles';
import ResellerVehicleDetail from './pages/reseller/ResellerVehicleDetail';
import SimpleResellerLogin from './components/SimpleResellerLogin';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Rentals from './pages/Rentals';
import SellCarPage from './pages/SellCar';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import VehicleDetail from './pages/VehicleDetail';
import Dashboard from './pages/admin/Dashboard';
import Analytics from './pages/admin/Analytics';
import VehicleManagement from './pages/admin/VehicleManagement';
import CustomerManagement from './pages/admin/CustomerManagement';
import ResellerManagement from './pages/admin/ResellerManagement';
import RentalManagement from './pages/admin/RentalManagement';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="vehicle/:id" element={<VehicleDetail />} />
              <Route path="vehicle/:id/sale" element={<VehicleDetail />} />
              <Route path="vehicle/:id/rental" element={<VehicleDetail />} />
              <Route path="rentals" element={<Rentals />} />
              <Route path="sell-car" element={<SellCarPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={<AdminLayout />}
            >
              <Route index element={<Dashboard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="vehicles" element={<VehicleManagement />} />
              <Route path="customers" element={<CustomerManagement />} />
              <Route path="resellers" element={<ResellerManagement />} />
              <Route path="rentals" element={<RentalManagement />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Reseller Routes */}
            <Route path="/reseller/login" element={<SimpleResellerLogin />} />
            <Route 
              path="/reseller" 
              element={
                <ProtectedRoute allowedRoles={['reseller']}>
                  <ResellerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ResellerDashboard />} />
              <Route path="vehicles" element={<ResellerVehicles />} />
              <Route path="vehicle/:id" element={<ResellerVehicleDetail />} />
              {/* Add more reseller routes here as needed */}
            </Route>
          </Routes>
          </Router>
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;