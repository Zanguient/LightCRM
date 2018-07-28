import express from "express";
import passport from "passport";
import controller from "../controllers/order";
const router = express.Router();


router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll);
router.post('/', passport.authenticate('jwt', {session: false}), controller.create);


export default router;