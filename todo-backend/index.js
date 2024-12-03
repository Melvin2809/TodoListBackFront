import express from 'express';
import cors from 'cors';
import sequelize from './db.js';

import routerTask from './src/routes/task.route.js';
import routerAuth from './src/routes/auth.route.js';
import passport from 'passport'; 
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'; 
import User from './src/models/user.model.js'; 
import groupRoutes from './src/routes/group.route.js';

// Initialize Express
const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

//authentification
// Initialize Passport JWT Strategy for authentication
passport.use( 
    new JwtStrategy( 
    { 
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
    secretOrKey: 'Mi@GE2023', 
    }, 
    (payload, done) => { 
    User.findByPk(payload.id) 
    .then((user) => { 
    if(user) { 
    return done(null, user); 
    } 
    return done(null, false); 
    }) 
    .catch((err) => { 
    console.log('Error in finding user by ID in JWT.'); 
    }); 
    } 
    ) 
   ); 
   app.use(passport.initialize())





// Apply routes 
app.use('/auth', routerAuth);
app.use('/tasks', passport.authenticate('jwt', { session: false }), routerTask);
app.use('/groups', groupRoutes);

 


// Launch the server
app.listen(port, () => {
    console.log(`Server Started at ${port}`)
});

// Synchronize all models
sequelize.sync().then(() => {
    console.log('Database & tables created.');
});