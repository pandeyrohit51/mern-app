const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

// @route       GET api/profile/me
// @desc         get current profile
router.get('/me', auth, async (req, res) => {
  try {
    // since it is a private route and we will get the token here and also the token contains the user object which has a id field and that we are using here. Also in the profile model we are keeping a reference of the user so we can query the profile collection by the user id
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for the user' });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// @route       POST api/profile
// @desc         create or update user profile
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;
    const profileFields = {
      user: req.user.id,
      company: company ? company : '',
      location: location ? location : '',
      website: website ? website : '',
      bio: bio ? bio : '',
      skills: Array.isArray(skills)
        ? skills
        : skills.split(',').map((skill) => skill.trim()),
      status: status ? status : '',
      githubusername: githubusername ? githubusername : '',
    };
    const socialFields = {
      youtube: youtube ? youtube : '',
      twitter: twitter ? twitter : '',
      facebook: facebook ? facebook : '',
      linkedin: linkedin ? linkedin : '',
      instagram: instagram ? instagram : '',
    };
    profileFields.social = socialFields;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

// @route         POST api/profile
// @desc          get all profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route         POST api/profile/user/:user_id
// @desc          get profile by user id
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      res.status(400).json({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    //becaue if user_id is not a valid object id for the user it goes to catch and throws server error so we are differentiating them here
    if (err.kind === 'ObjectId')
      return res.status(400).json({ msg: 'Profile not found' });
    res.status(500).send('Server Error');
  }
});

module.exports = router;
