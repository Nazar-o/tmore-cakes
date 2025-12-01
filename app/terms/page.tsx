export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
                        <span className="gradient-text-dark">Tmore's Cakes – Terms & Acknowledgement</span>
                    </h1>

                    <p className="text-lg text-gray-700 mb-8 text-center">
                        By proceeding with payment, you acknowledge and agree to the following terms.
                    </p>

                    <div className="space-y-8">
                        {/* Payment Terms */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Payment Terms</h2>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Last-minute orders (placed within 7 days or less to your event date) require full payment immediately upon invoice receipt — no exceptions.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Payment methods:</span>
                                </li>
                                <li className="ml-6 space-y-2">
                                    <div className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Zelle: <a href="mailto:Tmorescakes@gmail.com" className="text-yellow-600 hover:text-yellow-700 underline">Tmorescakes@gmail.com</a></span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Pay via invoice (credit/debit card)</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>For orders placed 3 or more weeks in advance, a 50% deposit is accepted. The remaining balance is due no later than 7 days before the event.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Deposits are non-refundable, but may be credited toward a future order if cancellation notice is provided at least 3 weeks before the event.</span>
                                </li>
                            </ul>
                        </section>

                        {/* Order Policies */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Order Policies</h2>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Orders over $400 may include up to 4 flavors or more, depending on the number of servings (restrictions apply).</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>All inquiries should include key details such as inscriptions, flavor(s), and any specific requests.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Flavors will be chosen for you. If flavor(s) or inscription details are not provided, they will be selected at our discretion.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>You acknowledge that Tmore's Cakes does not offer allergy-free options.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>If an inscription is not specified at the time of inquiry, it will be omitted from the final design.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Orders are confirmed only with a 50% deposit or full payment, depending on the order timing.</span>
                                </li>
                            </ul>
                        </section>

                        {/* Pickup, Delivery & Responsibility */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-gray-900">3. Pickup, Delivery & Responsibility</h2>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Delivery is not included unless requested.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Late pickups will incur a $20 fee for the first hour and $5 for each additional hour.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Once picked up, Tmore's Cakes is not responsible for any damage to the cake. Please follow all transport and storage guidelines:</span>
                                </li>
                            </ul>

                            <div className="mt-4 ml-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Transport Tips:</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Do not place the cake on your lap or car seat.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Keep cake flat and level during transport.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Set car A/C to the coldest setting.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Refrigerate if cake is picked up or delivered 2+ hours before your event.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Do not leave cake in a hot car.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Keep venue temperature at 72°F or lower.</span>
                                    </li>
                                </ul>
                                <p className="mt-4 text-gray-700 italic font-medium">
                                    Drive like it's a baby made of glass — no sudden stops, sharp turns, or slamming brakes.
                                </p>
                            </div>
                        </section>
                    </div>

                    <div className="mt-12 text-center">
                        <a href="/" className="btn-secondary">
                            ← Back to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

