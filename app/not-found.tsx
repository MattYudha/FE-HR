import Link from 'next/link';

export default function NotFound() {
  return (
    <html>
      <head>
        <title>Not Found</title>
      </head>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
          <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mb-8 text-2xl font-semibold text-gray-700">Page Not Found</h2>
          <p className="mb-8 text-gray-600">
            Could not find the requested resource. Please check the URL.
          </p>
          <Link href="/" className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800">
            Return Home
          </Link>
        </div>
      </body>
    </html>
  );
}