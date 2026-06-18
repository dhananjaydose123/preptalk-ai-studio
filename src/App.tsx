import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Discussion from "./pages/Discussion";
import InterviewHistory from "./pages/InterviewHistory";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ScrollbarVisibility = () => {
  useEffect(() => {
    const root = document.documentElement;
    let scrollTimeout: number | undefined;

    const setScrollingState = () => {
      root.dataset.scrolling = "true";

      window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        delete root.dataset.scrolling;
      }, 900);
    };

    const handleKeyDown = () => {
      setScrollingState();
    };

    window.addEventListener("scroll", setScrollingState, { passive: true });
    window.addEventListener("wheel", setScrollingState, { passive: true });
    window.addEventListener("touchmove", setScrollingState, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", setScrollingState);
      window.removeEventListener("wheel", setScrollingState);
      window.removeEventListener("touchmove", setScrollingState);
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(scrollTimeout);
      delete root.dataset.scrolling;
    };
  }, []);

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <PageTransition>
              <Signup />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageTransition>
              <Dashboard />
            </PageTransition>
          }
        />
        <Route
          path="/interview"
          element={
            <PageTransition>
              <Interview />
            </PageTransition>
          }
        />
        <Route
          path="/discussion"
          element={
            <PageTransition>
              <Discussion />
            </PageTransition>
          }
        />
        <Route
          path="/history"
          element={
            <PageTransition>
              <InterviewHistory />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <About />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ScrollbarVisibility />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
