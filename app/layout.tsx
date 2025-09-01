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
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
} 