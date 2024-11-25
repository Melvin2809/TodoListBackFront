import React, { useState } from 'react';
import { 
    Bars3Icon, 
    XMarkIcon,
    HomeIcon,
    ClipboardDocumentListIcon,
    UserGroupIcon,
    CalendarIcon,
    ChartBarIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const menuItems = [
        {
            title: 'Dashboard',
            icon: <HomeIcon className="w-6 h-6" />,
            path: '/'
        },
        {
            title: 'Mes Tâches',
            icon: <ClipboardDocumentListIcon className="w-6 h-6" />,
            path: '/tasks'
        },
        {
            title: 'Équipe',
            icon: <UserGroupIcon className="w-6 h-6" />,
            path: '/team'
        },
        {
            title: 'Calendrier',
            icon: <CalendarIcon className="w-6 h-6" />,
            path: '/calendar'
        },
        {
            title: 'Rapports',
            icon: <ChartBarIcon className="w-6 h-6" />,
            path: '/reports'
        },
        {
            title: 'Paramètres',
            icon: <Cog6ToothIcon className="w-6 h-6" />,
            path: '/settings'
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

            {/* Overlay sombre pour mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 h-full bg-white shadow-lg z-40
                transition-all duration-300 ease-in-out
                ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0 lg:w-20'}
            `}>
                {/* Logo */}
                <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-white">
                    {isOpen ? (
                        <span className="text-xl font-bold text-green-600">ToDo List</span>
                    ) : (
                        <span className="text-xl font-bold text-green-600 hidden lg:block">TDL</span>
                    )}
                </div>

                {/* Menu Items */}
                <nav className="mt-6">
                    {menuItems.map((item, index) => (
                        <a
                            key={index}
                            href={item.path}
                            className={`
                                flex items-center px-6 py-3 text-gray-600 hover:bg-green-50 hover:text-green-600
                                transition-all duration-200 ease-in-out
                                ${!isOpen && 'lg:justify-center'}
                            `}
                        >
                            <span className="text-gray-500 hover:text-green-600">
                                {item.icon}
                            </span>
                            {(isOpen || window.innerWidth < 1024) && (
                                <span className="ml-3 font-medium">{item.title}</span>
                            )}
                        </a>
                    ))}
                </nav>

                {/* Toggle Button pour desktop */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        hidden lg:flex absolute -right-3 top-16 bg-white border border-gray-200
                        rounded-full p-1.5 hover:bg-gray-50 transform transition-transform duration-200
                        ${isOpen ? 'rotate-0' : 'rotate-180'}
                    `}
                >
                    <Bars3Icon className="w-4 h-4 text-gray-600" />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;