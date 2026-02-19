import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PlanEnforcementProvider } from "./context/PlanEnforcementContext";
import { RolesProvider } from "./context/RolesContext";
import { VoiceProvider } from "./context/VoiceContext";
import UpgradePaywall from "./components/UpgradePaywall";
import MadeWithBlueLotus from "./components/MadeWithBlueLotus";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import BuilderNew from "./pages/BuilderNew";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import Legal from "./pages/Legal";
import LegalNav from "./pages/LegalNav";
import ComplianceCenter from "./pages/ComplianceCenter";
import Checkout from "./pages/Checkout";
import CreditRules from "./pages/CreditRules";
import PlanDemo from "./pages/PlanDemo";
import OwnerDashboard from "./pages/OwnerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <PlanEnforcementProvider>
        <VoiceProvider>
          <div className="App">
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/legal" element={<LegalNav />} />
                <Route path="/legal/:docId" element={<Legal />} />
                <Route path="/compliance" element={<ComplianceCenter />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/credits" element={<CreditRules />} />
              <Route path="/plan-demo" element={<PlanDemo />} />
                
                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/new-project"
                  element={
                    <ProtectedRoute>
                      <NewProject />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/builder/:id"
                  element={
                    <ProtectedRoute>
                      <Builder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings/:tab"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/owner"
                  element={
                    <ProtectedRoute>
                      <OwnerDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <UpgradePaywall />
              {/* Made with Blue Lotus Badge */}
              <div className="fixed bottom-4 right-4 z-50">
                <MadeWithBlueLotus />
              </div>
            </BrowserRouter>
          </div>
        </VoiceProvider>
      </PlanEnforcementProvider>
    </AuthProvider>
  );
}

export default App;
