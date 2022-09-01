import express from 'express';
import { UserRegister, UserLogin, GetAllUsers } from '../controllers/AuthController';
import { Authenticate } from '../middlewares';

const router = express.Router();

router.post('/register', UserRegister);

router.post('/login', UserLogin);

//authenticate
router.use(Authenticate);

router.get('/allusers', GetAllUsers);

export { router as UserRoute };
