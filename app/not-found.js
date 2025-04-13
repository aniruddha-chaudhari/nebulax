import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-6xl font-bold mb-6">404</h1>
      <h2 className="text-2xl mb-6">Page Not Found</h2>
      <p className="mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        href="/"
        className="px-5 py-3 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
      >
        Back to Home
      </Link>
    </div>
  );
}