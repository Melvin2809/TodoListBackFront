import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Task from "./Task";
import { getCookie } from 'cookies-next';


export default function TaskList({ setOpen, setIsUpdate, setCurrentTask }) {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('deadline'); // 'deadline', 'status', 'title'

    const fetchTasks = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = getCookie('authToken');
            const response = await fetch('http://localhost:3001/tasks', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            
            if (Array.isArray(data)) {
                setTasks(data);
            } else {
                throw new Error('La réponse de l\'API n\'est pas un tableau');
            }
        } catch (error) {
            setError(error.message);
            setTasks([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const isLate = (task) => {
        const currentDate = new Date();
        const deadlineDate = new Date(task.deadline);
        return deadlineDate < currentDate && 
               task.status !== 'complétée' && 
               task.status !== 'abandonnée';
    };

    const sortTasks = (tasksToSort) => {
        return [...tasksToSort].sort((a, b) => {
            switch (sortBy) {
                case 'deadline':
                    return new Date(a.deadline) - new Date(b.deadline);
                case 'status':
                    return a.status.localeCompare(b.status);
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });
    };

    const sortedTasks = sortTasks(tasks);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <ArrowPathIcon className="w-8 h-8 text-green-500 animate-spin" />
                <p className="mt-4 text-sm text-gray-500">Chargement des tâches...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg bg-red-50 p-6 mx-4 my-6">
                <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                    <h3 className="ml-3 text-sm font-medium text-red-800">
                        Erreur lors du chargement des tâches
                    </h3>
                </div>
                <div className="mt-2 text-sm text-red-700">
                    {error}
                </div>
                <button
                    onClick={fetchTasks}
                    className="mt-4 text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:underline"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="text-center py-12">
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune tâche</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Commencez par créer une nouvelle tâche.
                </p>
                <div className="mt-6">
                    <button
                        onClick={() => {
                            setCurrentTask({
                                id: '',
                                title: '',
                                category: '',
                                deadline: '',
                                status: 'à faire',
                                assignedUser: '',
                                groupId: ''
                            });
                            setIsUpdate(false);
                            setOpen(true);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <span>Nouvelle tâche</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Sort controls */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                        {tasks.length} tâche{tasks.length > 1 ? 's' : ''}
                    </span>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Trier par:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-sm border-gray-300 rounded-md focus:border-green-500 focus:ring-green-500"
                        >
                            <option value="deadline">Date</option>
                            <option value="status">Statut</option>
                            <option value="title">Titre</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Task list */}
            <AnimatePresence>
                <ul role="list" className="divide-y divide-gray-100">
                    {sortedTasks.map((task) => (
                        <motion.li
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Task
                                task={task}
                                setOpen={setOpen}
                                setIsUpdate={setIsUpdate}
                                setCurrentTask={setCurrentTask}
                                isLate={isLate(task)}
                            />
                        </motion.li>
                    ))}
                </ul>
            </AnimatePresence>
        </div>
    );
}