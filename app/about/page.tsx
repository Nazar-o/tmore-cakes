'use client';

import Footer from '@/app/components/Footer';
import FadeInSection from '@/app/components/FadeInSection';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white pt-20">
            <div className="container mx-auto px-4">
                {/* Back to Home - Top Left */}
                <div className="mb-10">
                    <a href="/" className="text-[#6B2E5F] hover:text-[#C8A2B8] transition-colors font-medium text-lg">
                        ← Back to Home
                    </a>
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <FadeInSection>
                        <div className="text-center mb-10">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#6B2E5F]">
                            <span className="gradient-text">About Me</span>
                        </h1>
                        <div className="w-32 h-1 bg-gradient-to-r from-[#C8A2B8] to-[#6B2E5F] mx-auto rounded-full"></div>
                        </div>
                    </FadeInSection>

                    {/* About Content */}
                    <FadeInSection delay={100}>
                        <div className="space-y-12">
                            <div className="text-center mb-10">
                            <img src="/images/tari.JPG" alt="Image of Tari, the baker." className="w-100 rounded-full mx-auto mb-6" />
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Hi, I'm Tari. <br /> The baker behind Tmore's Cakes!
                            </h2>
                        </div>

                        <div className="card">
                            <div className="space-y-12">

                                <div className="text-center">
                                    <p className="about-text">
                                        My love for baking started when I was a kid, watching my mom whip up sweet treats like meat pies, cakes, muffins, and pastries. I baked my first cakes on a little stovetop oven (until my dad swooped in with a gas oven) and soon I was baking for my little cousins and anyone who'd let me practice.
                                    </p>
                                    <br />
                                    <p className="about-text">
                                        Fast forward a few years, when I had my son, that love for baking reignited. By the time he turned two, friends were asking me to make cakes for their celebrations, and the referrals kept pouring in from friends of friends to neighbors, and then the whole community. That's how Tmore's Cakes came to be.
                                    </p>
                                    <br />
                                    <p className="about-text">
                                        By day, I'm an ERP Consultant/Business Analyst. But once I'm home, it's apron on, oven on and nothing makes me happier than creating cakes that make your moments unforgettable.
                                    </p>
                                    <br />
                                    <p className="about-text">
                                        At Tmore's Cakes, every cake is baked with love, creativity, and a whole lot of joy because your celebrations deserve the sweetest touch.
                                    </p>
                                </div>
                            </div>
                        </div>
                        </div>
                    </FadeInSection>

                    {/* Call to Action */}
                    <FadeInSection delay={200}>
                        <div className="text-center mt-20">
                            <div className="bg-gradient-to-r from-[#FAF8F6] to-white rounded-3xl p-16 shadow-lg">
                                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                                    Ready to Taste the Difference?
                                </h3>
                                <p className="mb-6 text-lg text-gray-600 font-medium">
                                    Let's create something sweet together for your next celebration!
                                </p>
                                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                    <a href="/#order-form" className="btn-primary text-lg px-10 py-4">
                                        Order Your Cake
                                    </a>
                                    <a href="/gallery" className="btn-primary text-lg px-10 py-4">
                                        View Gallery
                                    </a>
                                </div>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </div>
            <br />
            <br />
            <Footer />
        </div>
    );
} 