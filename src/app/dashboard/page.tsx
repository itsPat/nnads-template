import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {session.user.name}</span>
            <form
              action={async () => {
                'use server';
                await signOut();
              }}
            >
              <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-6">
        <h2 className="text-xl font-semibold mb-6">Your AI Image Projects</h2>
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-600">
            No images yet. Upload your first image to get started!
          </p>
        </div>
      </main>
    </div>
  );
}
