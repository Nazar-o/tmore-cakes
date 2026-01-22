import type { Metadata } from 'next';
import './styles/globals.css';

export const metadata: Metadata = {
    title: 'TMore Cakes - Custom Cake Orders',
    description: 'Crafting Sweet Memories, One Slice at a Time',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
} 