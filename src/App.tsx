import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/Header";
import RecipeSearch from "./components/RecipeSearch";
import PantryManager from "./components/PantryManager";
import { ActiveView } from "./types";

const queryClient = new QueryClient();

const App = () => {
  const [activeView, setActiveView] = useState<ActiveView>('search');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-background">
          <Header activeView={activeView} onViewChange={setActiveView} />
          <main className="py-8">
            {activeView === 'search' ? <RecipeSearch /> : <PantryManager />}
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
