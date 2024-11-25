import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function TaskForm({ currentTask, setCurrentTask, isUpdate }) {
    const router = useRouter();
    const [errors, setErrors] = useState({ title: "", category: "", deadline: "" }); // Gestion des erreurs

    const validateForm = () => {
        const newErrors = {};
        if (!currentTask.title || currentTask.title.trim() === "") {
            newErrors.title = "Le champ titre est requis.";
        }
        if (!currentTask.category || currentTask.category.trim() === "") {
            newErrors.category = "Le champ catégorie est requis.";
        }
        if (!currentTask.deadline || currentTask.deadline.trim() === "") {
            newErrors.deadline = "Le champ deadline est requis.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Retourne true si aucune erreur
    };

    const submitForm = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return; // Bloque la soumission si le formulaire est invalide
        }
        
        

        let fetchMethod = 'POST';
        let url = 'http://localhost:3001/tasks';

        if (isUpdate) {
            fetchMethod = 'PUT';
            url = `http://localhost:3001/tasks/${currentTask.id}`;
        }

        await fetch(url, {
            method: fetchMethod,
            body: JSON.stringify({
                title: currentTask.title,
                category: currentTask.category,
                deadline: currentTask.deadline,
                status: currentTask.status,
                assignedUser: currentTask.assignedUser,
                groupId: currentTask.groupId
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    alert(isUpdate ? "Tâche modifiée !" : "Tâche ajoutée !");
                    router.refresh(); // Recharge la liste des tâches
                } else {
                    throw new Error("Erreur lors de l'ajout/modification.");
                }
            })
            .catch(() => alert("Erreur lors de l'ajout/modification. Réessayez."));
    };
    const InputField = ({ id, type = "text", value, onChange, error }) => (
        <div className="col-span-full space-y-2">
            
            <input
                type={type}
                id={id}
                name={id}
                value={value || ''}
                onChange={onChange}
                className={`w-full px-4 py-2 rounded-lg border transition duration-150 ease-in-out
                    ${error ? 'border-red-500 ring-red-500' : 'border-gray-300 hover:border-gray-400'}
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                    bg-white shadow-sm`}
            />
            {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
    return (
        <form onSubmit={submitForm}>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* Titre */}
                <div className="col-span-full">
                    <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                        Titre
                    </label>
                    <div className="mt-2">
                    <InputField
                    id="title"
                    value={currentTask.title}
                    onChange={(e) => {
                        setCurrentTask({ ...currentTask, title: e.target.value });
                        setErrors({ ...errors, title: "" });
                    }}
                    error={errors.title}
                />
                    </div>
                    
                </div>

                {/* Catégorie */}
                <div className="col-span-full">
                    <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                        Catégorie
                    </label>
                    <div className="mt-2">
                    <InputField
                        label="Catégorie"
                        id="category"
                        value={currentTask.category}
                        onChange={(e) => {
                            setCurrentTask({ ...currentTask, category: e.target.value });
                            setErrors({ ...errors, category: "" });
                        }}
                        error={errors.category}
                    />
                    </div>
                </div>

                {/* Deadline */}
                <div className="col-span-full">
                    <label htmlFor="deadline" className="block text-sm font-medium leading-6 text-gray-900">
                        Deadline
                    </label>
                    <div className="mt-2">
                    <InputField
                    label="Deadline"
                    id="deadline"
                    type="date"
                    value={currentTask.deadline}
                    onChange={(e) => {
                        setCurrentTask({ ...currentTask, deadline: e.target.value });
                        setErrors({ ...errors, deadline: "" });
                    }}
                    error={errors.deadline}
                    />
                    </div>
                    
                </div>

                {/* Statut */}
                <div className="col-span-full">
                    <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                        Statut
                    </label>
                    <div className="mt-2">
                        <select
                            name="status"
                            id="status"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                            onChange={(e) => {
                                setCurrentTask({
                                    ...currentTask,
                                    status: e.target.value,
                                });
                            }}
                            value={currentTask.status}
                        >
                            <option value="à faire">À faire</option>
                            <option value="en cours">En cours</option>
                            <option value="complétée">Complétée</option>
                            <option value="abandonnée">Abandonnée</option>
                        </select>
                    </div>
                </div>

                {/* Utilisateur assigné */}
                <div className="col-span-full">
                    <label htmlFor="assignedUser" className="block text-sm font-medium leading-6 text-gray-900">
                        Assigné à (ID utilisateur)
                    </label>
                    <div className="mt-2">
                        <input
                            type="number"
                            name="assignedUser"
                            id="assignedUser"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                            onChange={(e) => {
                                setCurrentTask({
                                    ...currentTask,
                                    assignedUser: e.target.value,
                                });
                            }}
                            value={currentTask.assignedUser || ''}
                        />
                    </div>
                </div>
                {/* Groupe */}
                <div className="col-span-full">
                    <label htmlFor="groupId" className="block text-sm font-medium leading-6 text-gray-900">
                        Groupe (ID)
                    </label>
                    <div className="mt-2">
                        <input
                            type="number"
                            name="groupId"
                            id="groupId"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                            onChange={(e) => {
                                setCurrentTask({
                                    ...currentTask,
                                    groupId: e.target.value,
                                });
                            }}
                            value={currentTask.groupId || ''}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    className="px-3 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    onClick={() => router.refresh()}
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800"
                >
                    {isUpdate ? "Modifier" : "Ajouter"}
                </button>
            </div>
        </form>
    );
}
