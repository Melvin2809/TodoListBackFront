import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { getCookie } from 'cookies-next';

export default function TaskForm({ currentTask, setCurrentTask, isUpdate }) {
    const router = useRouter();

    // État local pour les champs du formulaire
    const [formValues, setFormValues] = useState({
        title: "",
        category: "",
        deadline: "",
        status: "à faire",
        assignedUser: "",
        groupId: "",
    });

    const [errors, setErrors] = useState({
        title: "",
        category: "",
        deadline: "",
        assignedUser: "",
        groupId: "",
    });

    const [groups, setGroups] = useState([]); // Liste des groupes

    // Synchronisation avec `currentTask` lorsque le composant est monté ou mis à jour
    useEffect(() => {
        if (currentTask) {
            setFormValues({ ...currentTask });
        }
    }, [currentTask]);

    // Charger les groupes disponibles
    useEffect(() => {
        const token = getCookie("authToken");
        fetch("http://localhost:3001/groups", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des groupes.");
                }
                return response.json();
            })
            .then((data) => setGroups(data))
            .catch((error) => console.error("Erreur :", error));
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!formValues.title || formValues.title.trim() === "") {
            newErrors.title = "Le champ titre est requis.";
        }
        if (!formValues.category || formValues.category.trim() === "") {
            newErrors.category = "Le champ catégorie est requis.";
        }
        if (!formValues.deadline || isNaN(new Date(formValues.deadline))) {
            newErrors.deadline = "La deadline doit être une date valide.";
        }
        if (!formValues.assignedUser || isNaN(formValues.assignedUser)) {
            newErrors.assignedUser = "Un ID utilisateur valide est requis.";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Retourne true si aucune erreur
    };

    const submitForm = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const fetchMethod = isUpdate ? "PUT" : "POST";
        const url = isUpdate
            ? `http://localhost:3001/tasks/${currentTask.id}`
            : "http://localhost:3001/tasks";

        await fetch(url, {
            method: fetchMethod,
            body: JSON.stringify(formValues),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('authToken')}`,
            },
        })
            .then((response) => {
                if (response.ok) {
                    alert(isUpdate ? "Tâche modifiée !" : "Tâche ajoutée !");
                    setCurrentTask(formValues); // Met à jour `currentTask` après succès
                    router.refresh();
                } else {
                    throw new Error("Erreur lors de l'ajout/modification.");
                }
            })
            .catch(() => alert("Erreur lors de l'ajout/modification. Réessayez."));
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prev) => ({ ...prev, [id]: value }));
        setErrors((prev) => ({ ...prev, [id]: "" })); // Réinitialise les erreurs pour ce champ
    };

    return (
        <form onSubmit={submitForm}>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* Titre */}
                <div className="col-span-full">
                    <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                        Titre
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={formValues.title}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors.title ? "ring-red-500" : "ring-gray-300"
                        }`}
                    />
                    {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                </div>

                {/* Catégorie */}
                <div className="col-span-full">
                    <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                        Catégorie
                    </label>
                    <input
                        type="text"
                        id="category"
                        value={formValues.category}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors.category ? "ring-red-500" : "ring-gray-300"
                        }`}
                    />
                    {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
                </div>

                {/* Deadline */}
                <div className="col-span-full">
                    <label htmlFor="deadline" className="block text-sm font-medium leading-6 text-gray-900">
                        Deadline
                    </label>
                    <input
                        type="date"
                        id="deadline"
                        value={formValues.deadline}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors.deadline ? "ring-red-500" : "ring-gray-300"
                        }`}
                    />
                    {errors.deadline && <p className="text-sm text-red-600">{errors.deadline}</p>}
                </div>

                {/* Statut */}
                <div className="col-span-full">
                    <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                        Statut
                    </label>
                    <select
                        id="status"
                        value={formValues.status}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-green-500"
                    >
                        <option value="à faire">À faire</option>
                        <option value="en cours">En cours</option>
                        <option value="complétée">Complétée</option>
                        <option value="abandonnée">Abandonnée</option>
                    </select>
                </div>

                {/* Utilisateur assigné */}
                <div className="col-span-full">
                    <label htmlFor="assignedUser" className="block text-sm font-medium leading-6 text-gray-900">
                        Assigné à (ID utilisateur)
                    </label>
                    <input
                        type="number"
                        id="assignedUser"
                        value={formValues.assignedUser}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors.assignedUser ? "ring-red-500" : "ring-gray-300"
                        }`}
                    />
                    {errors.assignedUser && (
                        <p className="text-sm text-red-600">{errors.assignedUser}</p>
                    )}
                </div>

                {/* Groupe */}
                <div className="col-span-full">
                    <label htmlFor="groupId" className="block text-sm font-medium leading-6 text-gray-900">
                        Groupe
                    </label>
                    <select
                        id="groupId"
                        value={formValues.groupId}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors.groupId ? "ring-red-500" : "ring-gray-300"
                        }`}
                    >
                        <option value="">Choisir un groupe</option>
                        {groups.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                    {errors.groupId && <p className="text-sm text-red-600">{errors.groupId}</p>}
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
