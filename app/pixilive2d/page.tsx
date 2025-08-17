import PixiLive2D from '@/components/PixiLive2D';
import Script from 'next/script';

export default function Home() {
  return (
    <>
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Pixi Live2D Demo
          </h1>
          <p className="text-gray-600">
            Control Live2D characters with expressions and motions
          </p>
        </header>
        <PixiLive2D />
      </div>
    </div>
    </>
  );
}