import messageController from '../controllers/message.controller';
import { Router } from 'express';
import { verifyUser } from '../middlewares/verifyUser';
import { controllerHandler } from '../middlewares/controllerHandler';

const messageRouter = Router();

messageRouter.get('/:receiverId', verifyUser, controllerHandler(messageController.getConversation));
messageRouter.post('/:id/mark-seen', verifyUser, controllerHandler(messageController.markMessageAsSeen));
// messageRouter.get("/", controllerHandler(messageController.getAllMessages));

export default messageRouter;