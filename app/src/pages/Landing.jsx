import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Footer from '../components/landing/Footer';
import './Landing.css';

function Landing() {
  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}

export default Landing;
