import express from "express";
import { submitContact, getContacts, getUnreadCount, markAsRead } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", submitContact);
router.get("/", getContacts);
router.get("/unread", getUnreadCount);
router.put("/:id/read", markAsRead);

export default router;