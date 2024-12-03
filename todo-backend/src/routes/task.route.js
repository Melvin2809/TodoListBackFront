import express from 'express';
import Task from '../models/task.model.js';
import Group from '../models/group.model.js';
import GroupMember from '../models/groupMember.model.js';
import User from '../models/user.model.js';
import Label from '../models/label.model.js';

// Initialisation du routeur
const routerTask = express.Router();

// Routes
routerTask.get('/', getAllTasks);
routerTask.post('/', createTask);
routerTask.get('/:id', getTaskById);
routerTask.put('/:id', updateTask);
routerTask.delete('/:id', deleteTask);
// Nouvelles routes
routerTask.get('/group/:groupId', getGroupTasks);
routerTask.post('/:taskId/labels', addLabel);
routerTask.post('/:groupId', createGroupTask);

export default routerTask;

// Fonctions
function getAllTasks(req, res) {
    Task.findAll()
        .then(tasks => res.json(tasks))
        .catch(error => res.status(500).json({ error: 'Erreur lors de la récupération des tâches.' }));
}

function getTaskById(req, res) {
    Task.findByPk(req.params.id)
        .then(task => {
            if (!task) return res.status(404).json({ error: 'Tâche non trouvée.' });
            res.json(task);
        })
        .catch(error => res.status(500).json({ error: 'Erreur lors de la récupération de la tâche.' }));
}

function createTask(req, res) {
    const { title, category, deadline, status, assignedUser, groupId, createdBy } = req.body;

    // Validation : Vérifier que les champs title, category et deadline sont renseignés
    if (!title || title.trim() === "") {
        return res.status(400).json({ error: "Le champ titre est requis." });
    }
    if (!category || category.trim() === "") {
        return res.status(400).json({ error: "Le champ catégorie est requis." });
    }
    if (!deadline) {
        return res.status(400).json({ error: "Le champ deadline est requis." });
    }

    // Création de la tâche
    Task.create({
        title,
        category,
        deadline,
        status,
        assignedUser,
        groupId
    })
    .then(task => res.status(201).json(task))
    .catch(error => res.status(400).json({ error: "Erreur lors de la création de la tâche." }));
}

function updateTask(req, res) {
    console.log("Requête reçue pour la mise à jour : ", req.body); // Log du body de la requête
    const { status } = req.body; // On ne met à jour que le statut pour ce cas précis

    // Validation : Vérifiez si le statut est valide
    const validStatuses = ['à faire', 'en cours', 'complétée', 'abandonnée'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Statut invalide." });
    }

    Task.findByPk(req.params.id)
        .then(task => {
            if (!task) {
                return res.status(404).json({ error: "Tâche non trouvée." });
            }
            return task.update({ status });
        })
        .then(updatedTask => res.json(updatedTask))
        .catch(error => {
            console.error("Erreur lors de la mise à jour : ", error); // Log de l'erreur
            res.status(500).json({ error: "Erreur lors de la mise à jour de la tâche." });
        });
}

function deleteTask(req, res) {
    Task.findByPk(req.params.id)
        .then(task => {
            if (!task) return res.status(404).json({ error: 'Tâche non trouvée.' });
            return task.destroy();
        })
        .then(() => res.sendStatus(200))
        .catch(error => res.status(500).json({ error: 'Erreur lors de la suppression de la tâche.' }));
}

function getGroupTasks(req, res) {
    const { groupId } = req.params;
    const { userId } = req.query;

    GroupMember.findOne({
        where: { groupId, userId }
    })
        .then(isMember => {
            if (!isMember) {
                return res.status(403).json({ error: 'Non membre de ce groupe.' });
            }

            return Task.findAll({
                where: { groupId },
                include: [
                    { model: User, as: 'assignee', attributes: ['id', 'email'] },
                    { model: Label }
                ]
            });
        })
        .then(tasks => res.json(tasks))
        .catch(error => res.status(500).json({ error: 'Erreur lors de la récupération des tâches du groupe.' }));
}

function addLabel(req, res) {
    const { taskId } = req.params;
    const { label, color, userId } = req.body;

    if (!label || label.trim() === "") {
        return res.status(400).json({ error: "Le libellé est requis." });
    }

    Task.findByPk(taskId)
        .then(task => {
            if (!task) {
                return res.status(404).json({ error: 'Tâche non trouvée.' });
            }
            if (task.isPrivate && task.createdBy !== userId) {
                return res.status(403).json({ error: 'Non autorisé.' });
            }
            return Label.create({
                taskId,
                label,
                color: color || '#000000'
            });
        })
        .then(newLabel => res.status(201).json(newLabel))
        .catch(error => res.status(400).json({ error: 'Erreur lors de la création de l\'étiquette.' }));
}

function createGroupTask(req, res) {
    const { groupId } = req.params;
    const userId = req.user.id;
    const { title, category, deadline, status, assignedUser } = req.body;

    // Vérifier si l'utilisateur est membre du groupe
    GroupMember.findOne({
        where: { 
            groupId: groupId,
            userId: userId
        }
    })
    .then(membership => {
        if (!membership) {
            throw new Error('Vous n\'êtes pas membre de ce groupe.');
        }

        return Task.create({
            title,
            category,
            deadline,
            status: status || 'à faire',
            assignedUser,
            groupId,
            createdBy: userId,
            isPrivate: false
        });
    })
    .then(task => {
        res.status(201).json(task);
    })
    .catch(error => {
        console.error('Erreur:', error);
        if (error.message === 'Vous n\'êtes pas membre de ce groupe.') {
            res.status(403).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message || 'Erreur lors de la création de la tâche de groupe.' });
        }
    });
}


