import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import CaseView from "./pages/CaseView";
import Auth from "./pages/Auth";
import { ChatPage } from "./pages/ChatPage";
import Efilling from "./components/EfillingBlocks/Efilling";
import { FloatingChatButton } from "@/components/FloatingChatButton";
import MeetingBuilder from "./components/meeting/MeetingBuilder";
import {LawyerDashboard} from "@/components/dashboard/LawyerDashboard";
import { JudgeDashboard } from "./components/dashboard/JudgeDashboard";
import { LitigantDashboard } from "./components/dashboard/LitigantDashboard";
import { AdminDashboard } from "./components/dashboard/AdminDashboard";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cases" element={<Cases />} />
                <Route path="/cases/:id" element={<CaseView />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/filecase" element={<Efilling />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/legal-ai" element={<ChatPage />} />
                <Route path="/meeting" element={<MeetingBuilder />} />
                <Route path="/dashboard/lawyerDashboard" element={<LawyerDashboard />} />
                <Route path="/dashboard/judgeDashboard" element={<JudgeDashboard />} />
                <Route path="/dashboard/litigantDashboard" element={<LitigantDashboard />} />
                <Route path="/dashboard/adminDashboard" element={<AdminDashboard />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <FloatingChatButton />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
