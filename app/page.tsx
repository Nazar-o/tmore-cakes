import CakeForm from './components/CakeForm';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import PricingSection from './components/PricingSection';
import GalleryPreview from './components/GalleryPreview';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <HeroSection />

            {/* About Section - Mobile optimized */}
            <section id="about" className="py-12 sm:py-16 lg:py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-6xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                            Meet Your <span className="gradient-text">Baker</span>
                        </h2>
                        <div className="w-32 sm:w-40 lg:w-48 h-1 sm:h-1.5 bg-gradient-to-r from-yellow-500 to-yellow-300 mx-auto mb-6 sm:mb-8 rounded-full"></div>

                        {/* Profile Image - Mobile responsive */}
                        <div className="mb-6 sm:mb-8">
                            <img
                                src="/images/home.JPG"
                                alt="Image of Tari, the baker."
                                className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 object-cover rounded-full mx-auto shadow-lg"
                            />
                        </div>

                        <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 sm:mb-10 lg:mb-12 font-medium leading-relaxed px-4">
                            Hi, I'm Tari! I've been passionate about baking since I was a little girl,
                            and now I'm turning that passion into creating magical moments for others.
                        </p>

                        <Link
                            href="/about"
                            className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-block"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <PricingSection />

            {/* Gallery Preview */}
            <GalleryPreview />

            {/* Main Order Form - Mobile optimized */}
            <section id="order-form" className="py-12 sm:py-16 lg:py-20 gradient-bg">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                            Ready to Order Your <span className="gradient-text">Dream Cake</span>?
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
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