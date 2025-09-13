import { Router } from "express";
import { room, signin, signup } from "../controllers/auth.controllers";
import { auth } from "../middleware/auth.middlleware";
const router:Router = Router();
router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/room').post(auth,room);
export default router ;
