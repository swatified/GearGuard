export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          GearGuard Maintenance Tracker
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Welcome to the Ultimate Maintenance Tracking System
        </p>
        <div className="space-x-4">
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
