import { Router } from "express";
import { room, roomChat, signin, signup } from "../controllers/auth.controllers";
import { auth } from "../middleware/auth.middlleware";
const router:Router = Router();
router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/room').post(auth,room);
router.route('/chats/:roomId').post(auth,roomChat);
export default router ;
