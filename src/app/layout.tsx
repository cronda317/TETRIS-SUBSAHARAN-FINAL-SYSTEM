import './globals.css';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import localFont from 'next/font/local';
import {environment} from '../environment/environment';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

const segment = localFont({
    src: './Segment7-4Gml.otf',
    variable: '--font-segment'
});

export const metadata: Metadata = {
    title: "Tetris Sub-Saharan Mindanao",
    description: 'A tetris game created with React & TypeScript'
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${segment.variable}`}>
            <body>{children}</body>
        </html>
    );
}
