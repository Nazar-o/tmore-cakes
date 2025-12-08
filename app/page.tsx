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
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 ">
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

            {/* Contact & Social Links Section */}
            <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                            <span className="gradient-text-dark">📞 Contact & Social Links</span>
                        </h2>
                        <div className="w-32 sm:w-40 lg:w-48 h-1 sm:h-1.5 bg-gradient-to-r from-yellow-500 to-yellow-300 mx-auto mb-8 sm:mb-10 rounded-full"></div>

                        <div className="space-y-6 mb-8">
                            <div className="flex flex-col items-center space-y-2">
                                {/* <div className="text-2xl">📧</div> */}
                                <a
                                    href="mailto:tmorescakes@gmail.com"
                                    className="text-xl text-gray-700 hover:text-yellow-600 transition-colors font-medium"
                                >
                                    Tmorescakes@gmail.com
                                </a>
                            </div>

                            <div className="flex flex-col items-center space-y-2">
                                {/* <div className="text-2xl">💳</div> */}
                                <span className="text-lg text-gray-600">Zelle: Tmorescakes@gmail.com</span>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="flex justify-center items-center space-x-6 mb-8">
                            <a
                                href="https://www.instagram.com/tmorescakes"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-yellow-600 transition-colors"
                                aria-label="Instagram"
                            >
                                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a
                                href="https://www.facebook.com/profile.php?id=100063474686693&mibextid=wwXIfr&rdid=u0nE7UgD5BNjGL0U&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Bo6Y41LMD%2F%3Fmibextid%3DwwXIfr#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-yellow-600 transition-colors"
                                aria-label="Facebook"
                            >
                                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a
                                href="https://www.tiktok.com/@tmorescakes"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-yellow-600 transition-colors"
                                aria-label="TikTok"
                            >
                                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}