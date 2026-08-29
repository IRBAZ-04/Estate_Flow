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

// Protected User Profile & Dashboards
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import TenantDashboard from './pages/tenant/TenantDashboard';

// Owner Property Management Pages
import MyProperties from './pages/owner/MyProperties';
import AddProperty from './pages/owner/AddProperty';
import EditProperty from './pages/owner/EditProperty';

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

            {/* Authenticated Profile */}
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
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

            {/* Owner Portal & Property Management */}
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
