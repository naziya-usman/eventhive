const express = require("express");
const router = express.Router();
const {
    registerForEvent,
    getMyTickets,
    cancelRegistration,
} = require("../controllers/registrationController");
const { protect } = require("../middleware/authMiddleware");

// All registration routes are protected
router.use(protect);

router.get("/my-tickets", getMyTickets);
router.post("/:id", registerForEvent);
router.delete("/:id", cancelRegistration);

module.exports = router;
