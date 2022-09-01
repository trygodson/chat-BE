import express from 'express';
import { AddMessage, GetAllMessage } from '../controllers/MessageController';
import { Authenticate } from '../middlewares';

const router = express.Router();

//authenticate
router.use(Authenticate);

router.post('/addmessage', AddMessage);

router.post('/getmessage', GetAllMessage);

export { router as MessageRoute };
