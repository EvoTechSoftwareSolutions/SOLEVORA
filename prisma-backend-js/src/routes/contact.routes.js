import express from "express";
import { 
  getAllMessages, 
  getUnreadMessagesCount, 
  markAsRead, 
  createMessage 
} from "../controllers/contact.controller.js";

const router = express.Router();

router.get("/", getAllMessages);
router.get("/unread", getUnreadMessagesCount);
router.put("/:id/read", markAsRead);
router.post("/", createMessage);

export default router;
