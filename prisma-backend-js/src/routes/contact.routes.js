import express from "express";
import { 
  getAllMessages, 
  getUnreadMessagesCount, 
  markAsRead, 
  createMessage,
  sendReply
} from "../controllers/contact.controller.js";

const router = express.Router();

router.get("/", getAllMessages);
router.get("/unread", getUnreadMessagesCount);
router.put("/:id/read", markAsRead);
router.post("/", createMessage);
router.post("/:id/reply", sendReply);

export default router;
