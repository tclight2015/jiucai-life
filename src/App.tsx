import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "./components/BottomNav";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Pool from "./pages/Pool.tsx";
import Profile from "./pages/Profile.tsx";
import Calendar from "./pages/Calendar.tsx";
import Rules from "./pages/Rules.tsx";
import Claim from "./pages/Claim.tsx";
import Recovery from "./pages/Recovery.tsx";
import Chat from "./pages/Chat.tsx";
import Leaderboard from "./pages/Leaderboard.tsx";
import Token from "./pages/Token.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <BottomNav />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/pool" element={<Pool />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/claim" element={<Claim />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/token" element={<Token />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
