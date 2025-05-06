import { ConverterCard } from "@/components/converter/converter-card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800 tracking-tight">Unit Converter</h1>
        <p className="text-center text-gray-500 mb-6">Convert between different units easily</p>
        <ConverterCard />
      </div>
    </main>
  )
}
