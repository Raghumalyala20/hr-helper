import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            HR Helper
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered recruitment assistant using Google Gemini
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* JD Generator Card */}
          <Link href="/jd-generator">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                JD Generator
              </h2>
              <p className="text-gray-600">
                Generate professional job descriptions from keywords and requirements
              </p>
            </div>
          </Link>

          {/* CV Screener Card */}
          <Link href="/cv-screener">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                CV Screener
              </h2>
              <p className="text-gray-600">
                Screen candidate CVs against job descriptions with AI-powered matching
              </p>
            </div>
          </Link>

          {/* Tech Quiz Card */}
          <Link href="/tech-quiz">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">💡</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Tech Assessment
              </h2>
              <p className="text-gray-600">
                Generate technical questions for candidate evaluation
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Powered by Google Gemini AI | Built with Next.js & FastAPI</p>
        </div>
      </div>
    </div>
  );
}
