import { AnimatePresence } from 'framer-motion';

interface MainLayoutProps {
    children: React.ReactNode;
    error: string | null;
}

export default function MainLayout({ children, error }: MainLayoutProps) {
    return (
        <main className="min-h-screen flex items-center">
            <div className="w-full container mx-auto px-4">
                <AnimatePresence>
                    {error && (
                        <div className="text-red-500 text-center absolute top-4 left-0 right-0 z-50">
                            {error}
                        </div>
                    )}
                </AnimatePresence>
                {children}
            </div>
        </main>
    );
}
