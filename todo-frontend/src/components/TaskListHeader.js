import React, { useMemo } from 'react';
import { PlusIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function TaskListHeader({ open, setOpen, setIsUpdate, setCurrentTask, tasks }) {
    
    const taskStats = useMemo(() => {
        return tasks.reduce((acc, task) => {
            if (task.status === 'à faire') acc.todo++;
            else if (task.status === 'en cours') acc.inProgress++;
            else if (task.status === 'complétée') acc.completed++;
            else if (task.status === 'abandonnée') acc.abondonned++;
            return acc;
        }, { todo: 0, inProgress: 0, completed: 0, abondonned:0 });
    }, [tasks]);
    const createNewTask = () => {
        setOpen(true);
        setIsUpdate(false);
        setCurrentTask({
            id: '',
            title: '',
            category: '',
            deadline: '',
            status: 'à faire',
            assignedUser: '',
            groupId: ''
        });
    };

    return (
        <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-6 flex items-center justify-between">
                    {/* Left side with title and stats */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <ClipboardDocumentListIcon className="h-8 w-8 text-green-600" />
                            <h1 className="text-2xl font-bold text-gray-900">
                                Mes tâches
                            </h1>
                        </div>
                        
                        {/* Optional stats */}
                        <div className="hidden sm:flex items-center space-x-4 ml-6">
                            <div className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-600">
                                À faire: <span className="font-semibold">{taskStats.todo}</span>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm ">
                                En cours: <span className="font-semibold">{taskStats.inProgress}</span>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-yellow-100 text-sm text-yellow-800">
                                Abandonnée: <span className="font-semibold">{taskStats.abondonned}</span>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-green-100 text-sm text-green-800">
                                Terminé: <span className="font-semibold">{taskStats.completed}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right side with actions */}
                    <div className="flex items-center space-x-4">
                        <div></div>

                        {/* Create task button */}
                        <button
                            type="button"
                            onClick={createNewTask}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-sm hover:shadow-md group"
                        >
                            <PlusIcon className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                            <span>Créer une tâche</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Optional divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>
    );
}