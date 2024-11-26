const express = require('express');
const { searchUsers, addUser, getAddedUsers, deleteUser, getFollowers } = require('../controllers/userListController'); // Adjust the path as necessary

const router = express.Router();

// Search users endpoint
router.get('/search', searchUsers);

// Add a user to addedUsers list
router.post("/users/:id/add/:userId", addUser);

// Get the added users list
router.get("/:id", getAddedUsers);

router.delete("/:currentUserId/remove/:userId", deleteUser);

router.get('/:userId/followers', getFollowers);
module.exports = router;