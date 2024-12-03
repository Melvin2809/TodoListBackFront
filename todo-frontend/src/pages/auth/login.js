import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setCookie('authToken', data.token);

        // Rediriger directement vers la liste des tâches
        router.push('/tasks');
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de la connexion.');
      }
    } catch (error) {
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
<div className="flex justify-center mb-6">
<img
          src="/logo.png" // Chemin relatif depuis le répertoire public
          alt="Logo ToDo List"
          className="w-28 h-30" // Ajustez la taille du logo selon vos besoins
        />
      </div>      <p className="text-gray-600 text-sm text-center mb-6">Connectez-vous pour accéder à vos tâches</p>

      <form onSubmit={submitForm}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Nom d'utilisateur
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Se connecter
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-500 text-center">
        Pas encore de compte ?{' '}
        <a href="/auth/signup" className="text-green-600 hover:underline">
          Créer un compte
        </a>
      </p>
    </div>
  );
}
