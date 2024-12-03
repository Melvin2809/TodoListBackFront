import express from 'express';
import User from '../models/user.model.js';

const routerUser = express.Router();

routerUser.get('/', async (req, res) => {
    try {
        console.log('Fetching all users');
        const users = await User.findAll({
            attributes: ['id', 'username'],
            order: [['username', 'ASC']]
        });
        
        console.log('Users found:', users.length);
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
});

export default routerUser;