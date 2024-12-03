import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import User from '../models/user.model.js';

const routerAuth = express.Router();

// Route pour la connexion
routerAuth.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis." });
    }

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
        }

        const payload = { id: user.id };
        const token = jwt.sign(payload, 'Mi@GE2023', { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

// Route pour l'inscription
routerAuth.post('/signup', async (req, res) => {
    const { username, password, phone, dateOfBirth } = req.body;

    if (!username || !password || !phone || !dateOfBirth) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Nom d\'utilisateur déjà pris.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            username,
            password: hashedPassword,
            phone,
            dateOfBirth,
        });

        res.status(201).json({ message: 'Utilisateur créé avec succès.', user: { username: newUser.username } });
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

// Route pour récupérer le profil utilisateur
routerAuth.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: ['username', 'phone', 'dateOfBirth'] });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        res.json(user);
    } catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

export default routerAuth;
