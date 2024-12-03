import React, { useState } from 'react';
import {
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    ClipboardDocumentListIcon,
    UserGroupIcon,
    CalendarIcon,
    ChartBarIcon,
    UserIcon,
    ArrowRightOnRectangleIcon // Icône pour déconnexion
} from '@heroicons/react/24/outline';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();

    const handleLogout = () => {
        deleteCookie('authToken'); // Supprime le cookie
        router.push('/auth/login'); // Redirige vers la page de connexion
    };

    const menuItems = [
        {
            title: 'Mes Tâches',
            icon: <HomeIcon className="w-6 h-6" />,
            path: '/'
        },
        {
            title: 'Équipe',
            icon: <UserGroupIcon className="w-6 h-6" />,
            path: '/groups'
        },
        {
            title: 'Profil',
            icon: <UserIcon className="w-6 h-6" />,
            path: '/profile' // Nouveau chemin pour le profil
        },
        {
            title: 'Déconnexion',
            icon: <ArrowRightOnRectangleIcon className="w-6 h-6 text-red-600" />,
            action: handleLogout // Action pour déconnexion
        }
    ];

    return (
        <div className="relative min-h-screen">
            {/* Bouton pour ouvrir/fermer sur mobile */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-md shadow-lg"
            >
                {isOpen ? (
                    <XMarkIcon className="w-6 h-6 text-gray-600" />
                ) : (
                    <Bars3Icon className="w-6 h-6 text-gray-600" />
                )}
            </button>

            {/* Sidebar */}
            <div className={`fixed top-10 left-0 h-full bg-white shadow-lg z-40 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20 lg:w-20'}`}>
                {/* Logo */}
                <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-white">
                    {isOpen ? (
                        <img
                            src="/logo.png" // Chemin relatif vers le logo dans le dossier public
                            alt="Logo ToDo List"
                            className="h-20" // Ajustez la taille selon vos besoins
                        />
                    ) : (
                        <img
                            src="/logo.png" // Un logo compact si disponible
                            alt="Logo ToDo List"
                            className="h-20" // Taille réduite pour l'état fermé
                        />
                    )}
                </div>

                {/* Menu Items */}
                <nav className="mt-6">
                    {menuItems.map((item, index) => (
                        <a
                            key={index}
                            href={item.path || '#'}
                            onClick={item.action || undefined}
                            className={`flex items-center px-6 py-3 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all duration-200 ease-in-out ${!isOpen && 'lg:justify-center'}`}
                        >
                            {item.icon}
                            {isOpen && <span className="ml-3 font-medium">{item.title}</span>}
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
