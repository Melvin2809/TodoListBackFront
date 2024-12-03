import express from 'express';
import { Group, User, GroupMember } from '../models/index.js';

const router = express.Router();

// Créer un groupe
router.post('/', async (req, res) => {
    try {
        const { name, description, userId } = req.body;
        
        if (!name || !userId) {
            return res.status(400).json({ 
                error: 'Le nom du groupe et l\'ID de l\'utilisateur sont requis' 
            });
        }

        // Créer le groupe
        const group = await Group.create({
            name,
            description,
            createdBy: userId
        });

        // Ajouter le créateur comme membre admin
        await GroupMember.create({
            groupId: group.id,
            userId: userId,
            role: 'admin'
        });

        res.status(201).json({
            message: 'Groupe créé avec succès',
            group: {
                id: group.id,
                name: group.name,
                description: group.description
            }
        });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la création du groupe',
            details: error.message 
        });
    }
});

// Récupérer les groupes d'un utilisateur
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const groups = await Group.findAll({
            include: [
                {
                    model: GroupMember,
                    where: { userId: userId },
                    required: true
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username']
                }
            ]
        });

        res.json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des groupes',
            details: error.message 
        });
    }
});

// Récupérer les membres d'un groupe
router.get('/:groupId/members', async (req, res) => {
    try {
        const { groupId } = req.params;
        
        const members = await GroupMember.findAll({
            where: { groupId },
            include: [{
                model: User,
                attributes: ['id', 'username']
            }]
        });

        res.json(members.map(member => ({
            id: member.User.id,
            username: member.User.username,
            role: member.role
        })));
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des membres',
            details: error.message 
        });
    }
});

// Inviter un membre
router.post('/:groupId/invite', async (req, res) => {
    try {
        const { groupId } = req.params;
        const { userId } = req.body;

        const existingMember = await GroupMember.findOne({
            where: { groupId, userId }
        });

        if (existingMember) {
            return res.status(400).json({ 
                error: 'L\'utilisateur est déjà membre de ce groupe' 
            });
        }

        await GroupMember.create({
            groupId,
            userId,
            role: 'member'
        });

        res.json({ message: 'Membre invité avec succès' });
    } catch (error) {
        console.error('Error inviting member:', error);
        res.status(500).json({ 
            error: 'Erreur lors de l\'invitation du membre',
            details: error.message 
        });
    }
});

// Supprimer un membre
router.delete('/:groupId/members/:userId', async (req, res) => {
    try {
        const { groupId, userId } = req.params;
        
        const member = await GroupMember.findOne({
            where: { groupId, userId }
        });

        if (!member) {
            return res.status(404).json({ error: 'Membre non trouvé' });
        }

        if (member.role === 'admin') {
            const adminCount = await GroupMember.count({
                where: { groupId, role: 'admin' }
            });

            if (adminCount <= 1) {
                return res.status(400).json({ 
                    error: 'Impossible de supprimer le dernier administrateur' 
                });
            }
        }

        await member.destroy();
        res.json({ message: 'Membre supprimé avec succès' });
    } catch (error) {
        console.error('Error removing member:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la suppression du membre',
            details: error.message 
        });
    }
});

// Promouvoir un membre en admin
router.post('/:groupId/promote/:userId', async (req, res) => {
    try {
        const { groupId, userId } = req.params;
        
        const member = await GroupMember.findOne({
            where: { groupId, userId }
        });

        if (!member) {
            return res.status(404).json({ error: 'Membre non trouvé' });
        }

        if (member.role === 'admin') {
            return res.status(400).json({ error: 'Le membre est déjà administrateur' });
        }

        await member.update({ role: 'admin' });
        res.json({ message: 'Membre promu administrateur avec succès' });
    } catch (error) {
        console.error('Error promoting member:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la promotion du membre',
            details: error.message 
        });
    }
});

// Quitter un groupe
router.delete('/:groupId/leave', async (req, res) => {
    try {
        const { groupId } = req.params;
        const { userId } = req.body;

        const member = await GroupMember.findOne({
            where: { groupId, userId }
        });

        if (!member) {
            return res.status(404).json({ error: 'Membre non trouvé' });
        }

        if (member.role === 'admin') {
            const adminCount = await GroupMember.count({
                where: { groupId, role: 'admin' }
            });

            if (adminCount <= 1) {
                return res.status(400).json({ 
                    error: 'En tant qu\'administrateur, vous devez d\'abord transférer vos droits' 
                });
            }
        }

        await member.destroy();
        res.json({ message: 'Vous avez quitté le groupe avec succès' });
    } catch (error) {
        console.error('Error leaving group:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la sortie du groupe',
            details: error.message 
        });
    }
});

// Récupérer tous les utilisateurs (pour l'invitation)
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username']
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des utilisateurs',
            details: error.message 
        });
    }
});

export default router; 