import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Dashboard - TMore\'s Cakes',
    description: 'Admin dashboard for managing cake orders and business operations',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
} 