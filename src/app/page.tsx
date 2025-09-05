import { auth } from '@/lib/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <nav className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold">AI Image Platform</h1>
        <div>
          {session?.user ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Transform Your Images with AI
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Upload, process, and enhance your images using cutting-edge AI
          technology
        </p>
        {!session?.user && (
          <Link
            href="/auth/signin"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
        )}
      </main>
    </div>
  );
}
