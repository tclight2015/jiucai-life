import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "./components/BottomNav";
import { Skeleton } from "@/components/ui/skeleton";

const Index      = lazy(() => import("./pages/Index"));
const About      = lazy(() => import("./pages/About"));
const Pool       = lazy(() => import("./pages/Pool"));
const Profile    = lazy(() => import("./pages/Profile"));
const Calendar   = lazy(() => import("./pages/Calendar"));
const Rules      = lazy(() => import("./pages/Rules"));
const Claim      = lazy(() => import("./pages/Claim"));
const Recovery   = lazy(() => import("./pages/Recovery"));
const Chat       = lazy(() => import("./pages/Chat"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Token      = lazy(() => import("./pages/Token"));
const Invite     = lazy(() => import("./pages/Invite"));
const NotFound   = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="min-h-screen bg-background max-w-lg mx-auto px-4 pt-8">
    <div className="flex flex-col items-center pt-8 pb-6 gap-2">
      <Skeleton className="h-10 w-56 rounded-lg" />
      <Skeleton className="h-4 w-36 rounded" />
    </div>
    <div className="space-y-3 mt-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <BottomNav />
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/invite" element={<Invite />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
