const express = require('express')
const router = express.Router()


const { editProfile } = require('../controllers/Profile/editProfileController');
const { getProfile } = require('../controllers/Profile/getProfileController');
const { deleteProfile } = require('../controllers/Profile/deleteProfileController');
const { checkAuth } = require('../middleware/checkAuth');

router.use(checkAuth);

router.put('/edit', editProfile);
router.get('/:id', getProfile);
router.delete('/deleteProfile', deleteProfile);

module.exports = router