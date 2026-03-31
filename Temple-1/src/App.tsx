import { Switch, Route } from "wouter";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PujariSection from "@/components/PujariSection";
import PujaTimings from "@/components/PujaTimings";
import DonationSection from "@/components/DonationSection";
import Footer from "@/components/Footer";
import DonatePage from "@/pages/DonatePage";
import { ThemeProvider } from "@/context/ThemeContext";

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PujariSection />
        <PujaTimings />
        <DonationSection />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen overflow-x-hidden">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/donate" component={DonatePage} />
          <Route component={Home} />
        </Switch>
      </div>
    </ThemeProvider>
  );
}

export default App;
