import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

// Protected User Profile, Favorites, Agreements & Payments
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import AgreementsList from './pages/agreements/AgreementsList';
import AgreementDetails from './pages/agreements/AgreementDetails';
import PaymentHistory from './pages/payments/PaymentHistory';

// Dashboards
import AdminDashboard from './pages/admin/AdminDashboard';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import TenantDashboard from './pages/tenant/TenantDashboard';

// Owner Property, Agreement & Financial Pages
import MyProperties from './pages/owner/MyProperties';
import AddProperty from './pages/owner/AddProperty';
import EditProperty from './pages/owner/EditProperty';
import OwnerInquiries from './pages/owner/OwnerInquiries';
import OwnerVisits from './pages/owner/OwnerVisits';
import CreateAgreement from './pages/owner/CreateAgreement';
import OwnerFinances from './pages/owner/OwnerFinances';

// Tenant Inquiry & Visit Pages
import MyInquiries from './pages/tenant/MyInquiries';
import MyVisits from './pages/tenant/MyVisits';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Public Pages */}
            <Route index element={<Home />} />
            <Route path="properties" element={<Properties />} />
            <Route path="properties/:id" element={<PropertyDetails />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="unauthorized" element={<Unauthorized />} />

            {/* Authenticated Profile, Favorites, Agreements & Payments */}
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="agreements"
              element={
                <ProtectedRoute>
                  <AgreementsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="agreements/:id"
              element={
                <ProtectedRoute>
                  <AgreementDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="payments"
              element={
                <ProtectedRoute>
                  <PaymentHistory />
                </ProtectedRoute>
              }
            />

            {/* Tenant Inquiries & Visits */}
            <Route
              path="tenant/inquiries"
              element={
                <ProtectedRoute>
                  <MyInquiries />
                </ProtectedRoute>
              }
            />
            <Route
              path="tenant/visits"
              element={
                <ProtectedRoute>
                  <MyVisits />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard */}
            <Route
              path="admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Owner Portal, Properties, Agreements & Financials */}
            <Route
              path="owner/dashboard"
              element={
                <ProtectedRoute allowedRoles={['owner', 'admin']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="owner/properties"
              element={
                <ProtectedRoute allowedRoles={['owner', 'admin']}>
                  <MyProperties />
                </ProtectedRoute>
              }
            />
            <Route
              path="owner/properties/add"
              element={
                <ProtectedRoute allowedRoles={['owner', 'admin']}>
                  <AddProperty />
                </ProtectedRoute>
              }
            />
            <Route
              path="owner/properties/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['owner', 'admin']}>
                  <EditProperty />
                </ProtectedRoute>
              }
            />
            <Route
              path="owner/inquiries"
              element={
                <ProtectedRoute allowedRoles={['owner', 'admin']}>
                  <OwnerInquiries />
                </ProtectedRoute>
              }
            />
            <Route
              path="owner/visits"
              element={
                <ProtectedRoute allowedRoles={['owner', 'admin']}>
                  <OwnerVisits />
                </ProtectedRoute>
              }
            />
            <Route
              path="owner/agreements/create"
              element={
                <ProtectedRoute allowedRoles={['owner', 'admin']}>
                  <CreateAgreement />
                </ProtectedRoute>
              }
            />
            <Route
              path="owner/finances"
              element={
                <ProtectedRoute allowedRoles={['owner', 'admin']}>
                  <OwnerFinances />
                </ProtectedRoute>
              }
            />

            {/* Tenant Dashboard */}
            <Route
              path="tenant/dashboard"
              element={
                <ProtectedRoute allowedRoles={['tenant', 'admin']}>
                  <TenantDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
