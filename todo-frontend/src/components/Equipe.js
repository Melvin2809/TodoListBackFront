import { getCookie } from 'cookies-next';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import Sidebar from "./Sidebar";
import jwtDecode from 'jwt-decode';

export default function Equipe() {
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentGroup, setCurrentGroup] = useState({
    id: '',
    name: '',
    description: '',
    createdBy: '',
    members: []
  });

  useEffect(() => {
    const token = getCookie('authToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    fetch(`http://localhost:3001/group/user/${userId}`, { 
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des groupes.');
        }
        return response.json();
      })
      .then((data) => setGroups(data))
      .catch((error) => console.error('Erreur:', error));
  }, [router]);

  const handleCreateGroup = async () => {
    const token = getCookie('authToken');
    const decodedToken = jwtDecode(token);
    
    try {
      const response = await fetch('http://localhost:3001/group/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: currentGroup.name,
          description: currentGroup.description,
          userId: decodedToken.id
        })
      });

      if (!response.ok) throw new Error('Erreur lors de la création du groupe');
      
      const newGroup = await response.json();
      setGroups([...groups, newGroup.group]);
      setOpen(false);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleEditGroup = (group) => {
    setCurrentGroup(group);
    setIsUpdate(true);
    setOpen(true);
  };

  const handleDeleteGroup = async (groupId) => {
    const token = getCookie('authToken');
    try {
      const response = await fetch(`http://localhost:3001/group/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      setGroups(groups.filter(group => group.id !== groupId));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleInviteMember = (groupId) => {
    // Logique pour inviter un membre
    console.log('Inviter un membre au groupe:', groupId);
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-semibold text-gray-700 mb-6">Mes Équipes</h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-gray-600">Gérez vos équipes et leurs membres</p>
            </div>
            <button
              onClick={handleCreateGroup}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Nouvelle Équipe
            </button>
          </div>

          <div className="grid gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                    <p className="text-gray-600 mt-1">{group.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleInviteMember(group.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="Inviter un membre"
                    >
                      <UserPlusIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEditGroup(group)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-full"
                      title="Modifier"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      title="Supprimer"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 