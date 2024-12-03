import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';

const API_URL = 'http://localhost:3001';

export default function Groups() {
    const router = useRouter();
    const [groups, setGroups] = useState([]);
    const [newGroup, setNewGroup] = useState({ name: '', description: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [members, setMembers] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroupForInvite, setSelectedGroupForInvite] = useState(null);
    const [groupErrors, setGroupErrors] = useState({});

    useEffect(() => {
        const token = getCookie('authToken');
        if (!token) {
            router.push('/auth/login');
            return;
        }
        fetchGroups();
    }, [router]);

    const fetchGroups = async () => {
        const token = getCookie('authToken');
        if (!token) return;

        try {
            const decodedToken = jwtDecode(token);
            console.log('Tentative de récupération des groupes pour userId:', decodedToken.id);
            
            const response = await axios.get(`${API_URL}/groups/user/${decodedToken.id}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Réponse des groupes:', response.data);
            setGroups(response.data);
            setError('');
        } catch (error) {
            console.error('Erreur détaillée:', error.response?.data || error.message);
            setError('Erreur lors de la récupération des groupes');
        }
    };

    const fetchGroupMembers = async (groupId) => {
        const token = getCookie('authToken');
        if (!token) return;

        try {
            console.log('Fetching members for group:', groupId);
            const response = await axios.get(`${API_URL}/groups/${groupId}/members`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Members received:', response.data);
            setMembers(response.data);
            setSelectedGroupId(groupId === selectedGroupId ? null : groupId);
        } catch (error) {
            console.error('Error fetching members:', error);
            setError('Erreur lors de la récupération des membres');
        }
    };

    const fetchUsers = async () => {
        const token = getCookie('authToken');
        if (!token) return;

        try {
            console.log('Fetching users');
            const response = await axios.get(`${API_URL}/groups/users`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Users received:', response.data);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Erreur lors de la récupération des utilisateurs');
        }
    };

    const handleInviteMember = async (groupId, userId) => {
        const token = getCookie('authToken');
        if (!token) return;

        try {
            console.log('Inviting user:', userId, 'to group:', groupId);
            await axios.post(
                `${API_URL}/groups/${groupId}/invite`,
                { userId },
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            await fetchGroupMembers(groupId);
            setSelectedGroupForInvite(null);
        } catch (error) {
            console.error('Invitation error:', error);
            setGroupErrors({
                ...groupErrors,
                [groupId]: error.response?.data?.error || 'Erreur lors de l\'invitation'
            });
        }
    };

    const handleRemoveMember = async (groupId, memberId) => {
        const token = getCookie('authToken');
        if (!token) return;

        try {
            await axios.delete(
                `${API_URL}/groups/${groupId}/members/${memberId}`,
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            await fetchGroupMembers(groupId);
        } catch (error) {
            console.error('Error removing member:', error);
            setError('Erreur lors de la suppression du membre');
        }
    };

    const handlePromoteToAdmin = async (groupId, memberId) => {
        const token = getCookie('authToken');
        if (!token) return;

        try {
            await axios.post(
                `${API_URL}/groups/${groupId}/promote/${memberId}`,
                {},
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            await fetchGroupMembers(groupId);
        } catch (error) {
            console.error('Error promoting member:', error);
            setError('Erreur lors de la promotion du membre');
        }
    };

    const handleLeaveGroup = async (groupId) => {
        const token = getCookie('authToken');
        if (!token) return;

        try {
            const decodedToken = jwtDecode(token);
            await axios.delete(
                `${API_URL}/groups/${groupId}/leave`,
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: { userId: decodedToken.id }
                }
            );
            await fetchGroups();
        } catch (error) {
            console.error('Error leaving group:', error);
            setGroupErrors({
                ...groupErrors,
                [groupId]: error.response?.data?.error || 'Erreur lors de la sortie du groupe'
            });
        }
    };

    const handleCreateGroup = async (event) => {
        event.preventDefault();
        const token = getCookie('authToken');
        if (!token) {
            setError('Non authentifié');
            setLoading(false);
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            console.log('Attempting to leave group:', {
                groupId: newGroup.id,
                userId: decodedToken.id
            });

            const response = await axios.post(`${API_URL}/groups`, {
                name: newGroup.name,
                description: newGroup.description,
                userId: decodedToken.id
            }, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Réponse création groupe:', response.data);
            await fetchGroups(); // Recharger la liste des groupes
            setNewGroup({ name: '', description: '' });
            setError('');
        } catch (error) {
            console.error('Erreur création groupe:', error.response || error);
            setError(error.response?.data?.error || 'Erreur lors de la création du groupe');
        } finally {
            setLoading(false);
        }
    };

    const handleInviteClick = (groupId) => {
        setSelectedGroupForInvite(groupId);
        fetchUsers();
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-8 bg-gray-100">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Gestion des Groupes</h1>

                    {error && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* Formulaire de création */}
                    <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Créer un nouveau groupe</h2>
                        <form onSubmit={handleCreateGroup} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nom du groupe
                                </label>
                                <input
                                    type="text"
                                    value={newGroup.name}
                                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    value={newGroup.description}
                                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows="3"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? 'Création en cours...' : 'Créer le groupe'}
                            </button>
                        </form>
                    </div>

                    {/* Liste des groupes avec fonctionnalités complètes */}
                    <div className="grid gap-4">
                        {groups.map(group => (
                            <div key={group.id} className="p-6 bg-white rounded-lg shadow-lg">
                                <h3 className="text-lg font-semibold">{group.name}</h3>
                                <p className="text-gray-600 mt-2">{group.description}</p>
                                
                                <div className="mt-4 flex space-x-2">
                                    <button
                                        onClick={() => fetchGroupMembers(group.id)}
                                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                                    >
                                        {selectedGroupId === group.id ? 'Masquer membres' : 'Voir membres'}
                                    </button>
                                    
                                    <button
                                        onClick={() => handleInviteClick(group.id)}
                                        className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                                    >
                                        Inviter
                                    </button>
                                    
                                    <button
                                        onClick={() => handleLeaveGroup(group.id)}
                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                                    >
                                        Quitter
                                    </button>
                                </div>

                                {groupErrors[group.id] && (
                                    <div className="mt-2 text-red-600 text-sm">
                                        {groupErrors[group.id]}
                                    </div>
                                )}

                                {selectedGroupId === group.id && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                                        <h4 className="font-medium mb-2">Membres</h4>
                                        <div className="space-y-2">
                                            {members.map(member => (
                                                <div key={member.id} className="flex justify-between items-center p-2 bg-white rounded-md">
                                                    <span>{member.username}</span>
                                                    <div className="space-x-2">
                                                        {member.role !== 'admin' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handlePromoteToAdmin(group.id, member.id)}
                                                                    className="px-2 py-1 text-sm bg-yellow-100 text-yellow-700 rounded"
                                                                >
                                                                    Promouvoir admin
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRemoveMember(group.id, member.id)}
                                                                    className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded"
                                                                >
                                                                    Retirer
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedGroupForInvite === group.id && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-medium">Inviter des membres</h4>
                                            <button 
                                                onClick={() => setSelectedGroupForInvite(null)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                Fermer
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Rechercher un utilisateur..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full p-2 border rounded-md mb-4"
                                        />
                                        <div className="space-y-2">
                                            {users
                                                .filter(user => 
                                                    user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
                                                    !members.some(member => member.id === user.id)
                                                )
                                                .map(user => (
                                                    <div key={user.id} className="flex justify-between items-center p-2 bg-white rounded-md">
                                                        <span>{user.username}</span>
                                                        <button
                                                            onClick={() => handleInviteMember(group.id, user.id)}
                                                            className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                                                        >
                                                            Inviter
                                                        </button>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
