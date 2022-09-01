import express from 'express';
import { CreateRoom, GetAllRoom } from '../controllers/RoomController';
import { Authenticate } from '../middlewares';

const router = express.Router();

//authenticate
router.use(Authenticate);

router.post('/createroom', CreateRoom);

router.get('/getrooms', GetAllRoom);

export { router as RoomRoute };
