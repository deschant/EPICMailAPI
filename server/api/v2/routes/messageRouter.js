import { Router } from 'express';
import validate from '../../../middleware/validate';
import messageController from '../controllers/messages';
import Auth from '../../../middleware/Auth';

const messageRouter = Router();
const { verifyToken } = Auth;
const {
  newMessage,
  getReceivedMessages,
  getUnreadMessages,
  getSentMessages,
  getOneMessage,
  deleteOneMessage,
} = messageController;

messageRouter.post('/', verifyToken, validate(true, 'newMessage'), newMessage);
messageRouter.get('/', getReceivedMessages);
messageRouter.get('/unread', getUnreadMessages);
messageRouter.get('/sent', getSentMessages);
messageRouter.get('/:messageId', getOneMessage);
messageRouter.delete('/:messageId', deleteOneMessage);

export default messageRouter;
