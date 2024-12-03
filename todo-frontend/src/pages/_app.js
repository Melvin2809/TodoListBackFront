import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <Component {...pageProps} />
    </div>
  )
}
