// components/Layout.js

export default function Layout({ children }) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-100 to-green-50"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="w-full max-w-4xl">{children}</div>
      </div>
    );
  }
  