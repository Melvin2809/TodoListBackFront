import TaskListHeader from "@/components/TaskListHeader";
import TaskList from "@/components/TaskList";
import TaskPanel from "@/components/TaskPanel";
import Sidebar from "@/components/Sidebar";
import { getCookie } from 'cookies-next';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Tasks() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    id: '',
    title: '',
    category: '',
    deadline: '',
    status: 'à faire',
    assignedUser: 1, // ID par défaut valide
    groupId: null,   // ou 1 si requis
});

  useEffect(() => {
    const token = getCookie('authToken');
    if (!token) {
      router.push('/auth/login'); // Redirige si non authentifié
      return;
    }

    fetch('http://localhost:3001/tasks', {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des tâches.');
        }
        return response.json();
      })
      .then((data) => setTasks(data))
      .catch((error) => console.error('Erreur lors de la récupération des tâches :', error));
  }, [router]);

  return (
    <div className="flex overflow-hidden">
      <Sidebar />
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <TaskListHeader
            open={open}
            setOpen={setOpen}
            setIsUpdate={setIsUpdate}
            setCurrentTask={setCurrentTask}
            tasks={tasks}
          />
          <div className="border-t border-gray-100 px-10 pb-5">
            <TaskList
              setOpen={setOpen}
              setIsUpdate={setIsUpdate}
              setCurrentTask={setCurrentTask}
              tasks={tasks} // Ajout de tasks ici
            />
          </div>
        </div>
        <TaskPanel
          open={open}
          setOpen={setOpen}
          isUpdate={isUpdate}
          currentTask={currentTask}
          setCurrentTask={setCurrentTask}
        />
      </div>
    </div>
  );
}
