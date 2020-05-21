const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

// @route       POST api/users
// desc         register user
router.post(
  '/',
  [
    check('name', 'Please enter a valid name').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with minimum 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send('This is User route ....');
  }
);

module.exports = router;
