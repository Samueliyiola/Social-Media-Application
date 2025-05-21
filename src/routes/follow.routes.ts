import followController from "../controllers/follow.controller";
import { controllerHandler } from "../middlewares/controllerHandler";
import { verifyUser } from "../middlewares/verifyUser";
import { Router } from 'express';


const followRouter = Router();

followRouter.post("/:id", verifyUser, controllerHandler(followController.followUser));
followRouter.get("/:id/followers", verifyUser, controllerHandler(followController.getUserFollowers));
followRouter.get("/:id/following", verifyUser, controllerHandler(followController.getUserFollowing));


export default followRouter;