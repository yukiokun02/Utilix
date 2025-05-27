import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import LoadingAnimation from "@/components/loading-animation";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import Home from "@/pages/home";
import ImageResizer from "@/pages/image-resizer";
import ImageConverter from "@/pages/image-converter";
import FileConverter from "@/pages/file-converter";
import FileCompressor from "@/pages/file-compressor";
import FontChanger from "@/pages/font-changer";
import CodeNotepad from "@/pages/code-notepad";
import About from "@/pages/about";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingAnimation />}
      </AnimatePresence>
      
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/image-resizer" component={ImageResizer} />
          <Route path="/image-converter" component={ImageConverter} />
          <Route path="/file-converter" component={FileConverter} />
          <Route path="/file-compressor" component={FileCompressor} />
          <Route path="/font-changer" component={FontChanger} />
          <Route path="/code-notepad" component={CodeNotepad} />
          <Route path="/about" component={About} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark min-h-screen bg-background text-foreground">
          <Navigation />
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
