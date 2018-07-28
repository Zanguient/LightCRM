import express from "express";
import passport from "passport";
import controller from "../controllers/analytics";
const router = express.Router();

router.get('/overview', passport.authenticate('jwt', {session: false}), controller.overview);
router.get('/analytics', passport.authenticate('jwt', {session: false}), controller.analytics);


export default router;