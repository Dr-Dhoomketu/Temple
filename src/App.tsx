import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PujariSection from "@/components/PujariSection";
import PujaTimings from "@/components/PujaTimings";
import DonationSection from "@/components/DonationSection";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen overflow-x-hidden">
        <Navbar />
        <main>
          <Hero />
          <PujariSection />
          <PujaTimings />
          <DonationSection />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
