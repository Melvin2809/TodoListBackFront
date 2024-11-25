import { useState, useEffect } from 'react';

import TaskListHeader from "@/components/TaskListHeader";
import TaskList from "@/components/TaskList";
import TaskPanel from '@/components/TaskPanel';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false); 
  const [currentTask, setCurrentTask] = useState({ 
    id: '',
    title: '',
    category: '',
    deadline: '',
    status: 'à faire',
    assignedUser: '',
    groupId: '',
  });
  useEffect(() => {
    fetch('http://localhost:3001/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Erreur lors de la récupération des tâches:', error));
  }, []);
  
  return (
    <div className="flex overflow-hidden ">

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
