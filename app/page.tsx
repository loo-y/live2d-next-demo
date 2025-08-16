import Live2DCanvas from '@/components/Live2DCanvas';
import ControlPanel from '@/components/ControlPanel';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Live2D Next.js Demo
          </h1>
          <p className="text-gray-600">
            Control Live2D characters with expressions and motions
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live2D Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Live2D Character
              </h2>
              <div className="flex justify-center">
                <Live2DCanvas />
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="lg:col-span-1">
            <ControlPanel />
          </div>
        </div>

        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Built with Next.js, Tailwind CSS, and Live2D Cubism SDK</p>
        </footer>
      </div>
    </div>
  );
}