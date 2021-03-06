const router = require('express').Router();

const {
    getAllUsers,
    getUserById,
    updateUser,
    createUser,
    deleteUser,
    addFriend,
    removeFriend
} = require('../../controllers/user-controller');

// /api/users
router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

// /api/users/:id
router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

// /api/users/userid/friends/friendid
router
    .route('/:userId/friends/:friendId')
    .post(addFriend)
    .delete(removeFriend);

module.exports = router;