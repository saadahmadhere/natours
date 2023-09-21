const express = require('express');

const getAllUsers = (req, res) => {
  res.status(500).json({ status: 'error', message: 'this route is not defined yet' });
};

const createUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'this route is not defined yet' });
};

const getUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'this route is not defined yet' });
};

const updateUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'this route is not defined yet' });
}

const deleteUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'this route is not defined yet' });
}

const router = express.Router();


router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);


module.exports = router;