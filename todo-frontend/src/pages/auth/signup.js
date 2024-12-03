import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error when typing
  };

  const validateForm = () => {
    // Vérification des champs
    if (!form.username) {
      return 'Le nom d\'utilisateur est requis.';
    }
    if (form.password.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères.';
    }
    if (form.password !== form.confirmPassword) {
      return 'Les mots de passe ne correspondent pas.';
    }
    if (!/^\d{10}$/.test(form.phone)) {
      return 'Le numéro de téléphone doit contenir exactement 10 chiffres.';
    }
    if (!form.dateOfBirth) {
      return 'La date de naissance est requise.';
    }
    return '';
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auth/signup', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        alert('Compte créé avec succès. Veuillez vous connecter.');
        router.push('/auth/login');
      } else {
        const data = await response.json();
        setError(data.message || 'Erreur lors de la création du compte.');
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
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
      </div>       <p className="text-gray-600 text-sm text-center mb-6">Créez votre compte pour commencer</p>

      <form onSubmit={submitForm}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Nom d'utilisateur
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Numéro de téléphone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
            Date de naissance
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
        >
          S'inscrire
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-500 text-center">
        Déjà un compte ?{' '}
        <a href="/auth/login" className="text-green-600 hover:underline">
          Se connecter
        </a>
      </p>
    </div>
  );
}
