import CakeForm from './components/CakeForm';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import PricingSection from './components/PricingSection';
import GalleryPreview from './components/GalleryPreview';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <HeroSection />

            <section id="about" className="py-10 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-4xl md:text-5xl font-bold">
                            Meet Your <span className="gradient-text">Baker</span>
                        </h2>
                        <div className="w-170 h-1.5 bg-gradient-to-r from-yellow-500 to-yellow-300 mx-auto my-3 rounded-full"></div>
                        <img src="/images/home.JPG" alt="Image of Tari, the baker." className="w-100 h-100 object-cover rounded-full mx-auto mb-6" />
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 font-medium">
                            Hi, I'm Tari! I've been passionate about baking since I was a little girl,
                            and now I'm turning that passion into creating magical moments for others.
                        </p>
                        <Link href="/about" className="btn-primary text-lg px-8 py-4 mt-10">
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <FeaturesSection />

            {/* Pricing Section */}
            <PricingSection />

            {/* Gallery Preview */}
            <GalleryPreview />

            {/* Main Order Form */}
            <section className="py-20 gradient-bg">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Ready to Order Your <span className="gradient-text">Dream Cake</span>?
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Fill out the form below and let's create something magical together!
                        </p>
                    </div>
                    <CakeForm />
                </div>
            </section>

            <Footer />
        </div>
    );
} 