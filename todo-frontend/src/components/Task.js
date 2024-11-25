import React from 'react';
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Clock, Tag, User, Users } from 'lucide-react';

export default function Task({ task, setOpen, setIsUpdate, setCurrentTask }) {
    const router = useRouter();
    const isLate = new Date(task.deadline) < new Date() && task.status !== "complétée";

    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                alert("Tâche supprimée !");
                router.refresh();
            } else {
                throw new Error('Erreur serveur');
            }
        } catch (error) {
            alert("Erreur lors de la suppression.");
        }
    };

    const handleUpdate = () => {
        setOpen(true);
        setIsUpdate(true);
        setCurrentTask({
            id: task.id,
            title: task.title,
            category: task.category,
            deadline: task.deadline,
            status: task.status,
            assignedUser: task.assignedUser,
            groupId: task.groupId,
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {task.title}
                </h3>
                {isLate && (
                    <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
                        En retard
                    </span>
                )}
            </div>

            <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className="mr-2" />
                    <time dateTime={task.deadline}>
                        Deadline: {new Date(task.deadline).toLocaleDateString()}
                    </time>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <Tag size={16} className="mr-2" />
                    <span>{task.category || "Catégorie non spécifiée"}</span>
                </div>

                <div className="flex items-center text-sm">
                    <div className={`px-2 py-1 rounded-full ${
                        task.status === "complétée" 
                            ? "bg-green-100 text-green-800" 
                            : task.status === "en cours"
                            ? "bg-blue-100 text-blue-800"
                            : task.status === "abandonnée"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                    }`}>
                        {task.status}
                    </div>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <User size={16} className="mr-2" />
                    <span>{task.assignedUser || "Non assigné"}</span>
                </div>

                {task.groupId && (
                    <div className="flex items-center text-sm text-gray-600">
                        <Users size={16} className="mr-2" />
                        <span>Groupe: {task.groupId || "Aucun groupe"}</span>
                    </div>
                )}
            </div>

            <div className="mt-4 flex justify-end space-x-3">
                <button
                    onClick={handleUpdate}
                    className="flex items-center px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                    <Pencil size={16} className="mr-1" />
                    Modifier
                </button>
                <button
                    onClick={() => deleteTask(task.id)}
                    className="flex items-center px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                    <Trash2 size={16} className="mr-1" />
                    Supprimer
                </button>
            </div>
        </div>
    );
}