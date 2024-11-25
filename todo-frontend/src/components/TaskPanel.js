import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import TaskForm from './TaskForm';

export default function TaskPanel({ open, setOpen, isUpdate, currentTask, setCurrentTask }) {
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog 
                as="div" 
                className="relative z-50" 
                onClose={setOpen}
            >
                {/* Backdrop overlay with blur effect */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-300"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-300"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-hidden bg-white shadow-2xl rounded-l-2xl">
                                        {/* Header */}
                                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <Dialog.Title className="text-lg font-semibold text-gray-900">
                                                    {isUpdate ? (
                                                        <span className="flex items-center gap-2">
                                                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                                                            Modifier la tâche
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-2">
                                                            <span className="h-2 w-2 rounded-full bg-green-500" />
                                                            Nouvelle tâche
                                                        </span>
                                                    )}
                                                </Dialog.Title>
                                                <button
                                                    type="button"
                                                    className="rounded-full p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <span className="sr-only">Fermer le panneau</span>
                                                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="relative flex-1 overflow-y-auto bg-white px-6 py-4">
                                            <div className="absolute inset-0 bg-grid-gray-100 opacity-5 pointer-events-none" />
                                            <TaskForm 
                                                currentTask={currentTask} 
                                                setCurrentTask={setCurrentTask} 
                                                isUpdate={isUpdate} 
                                            />
                                        </div>

                                        {/* Optional footer for additional actions */}
                                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                                            <div className="text-xs text-gray-500 text-center">
                                                Appuyez sur Échap pour fermer
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}