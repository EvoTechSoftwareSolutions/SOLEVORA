import express from "express";
import { subscribe, getAllSubscribers, deleteSubscriber } from "../controllers/newsletterController.js";

const router = express.Router();

router.post("/subscribe", subscribe);
router.get("/subscribers", getAllSubscribers);
router.delete("/subscribers/:id", deleteSubscriber);

export default router;