// components/LogoutButton.js

import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie('authToken');
    router.push('/auth/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
    >
      Déconnexion
    </button>
  );
}
