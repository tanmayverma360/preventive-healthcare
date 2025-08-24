import express from 'express';
import User from '../models/User.js'; // Make sure to add .js extension

const router = express.Router();

// ... (the rest of your login and checkin routes remain exactly the same)

// @route   POST api/login
// @desc    Login user (or register if they don't exist)
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`\n--- Login attempt for: ${email} ---`); // Log attempt

    if (!email || !password) {
        console.log("Login failed: Missing email or password.");
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    // ... (rest of the function is the same)
    User.findOne({ email })
        .then(user => {
            if (user) {
                console.log("User found in database. Checking password...");
                if (password === user.password) {
                    console.log("Password matches. Login successful.");
                    return res.json(user);
                } else {
                    console.log("Password does NOT match. Invalid credentials.");
                    return res.status(400).json({ msg: 'Invalid credentials' });
                }
            } else {
                console.log("User not found. Creating a new user...");
                const newUser = new User({
                    name: 'Test User',
                    email,
                    password,
                });

                newUser.save()
                    .then(savedUser => {
                        console.log("New user created and saved successfully.");
                        res.json(savedUser);
                    })
                    .catch(err => {
                        console.log("Error saving new user:", err);
                        res.status(500).json({ msg: 'Server error during registration.' });
                    });
            }
        })
        .catch(err => {
            console.log("Database error during findOne:", err);
            res.status(500).json({ msg: 'Server error during login.' });
        });
});

// @route   POST api/checkin
// @desc    Add health data for a user
router.post('/checkin', (req, res) => {
    // ... (function is the same)
    const { userId, ...healthData } = req.body;
    User.findById(userId)
        .then(user => {
            user.healthData.push(healthData);
            user.save().then(updatedUser => res.json(updatedUser));
        })
        .catch(err => res.status(404).json({ msg: 'User not found' }));
});
// routes/api.js

// ... (keep all the other routes like /login and /checkin)

// @route   GET api/healthdata/:userId
// @desc    Get all health data for a user
router.get('/healthdata/:userId', (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user) return res.status(404).json({ msg: 'User not found' });
      res.json(user.healthData);
    })
    .catch(err => res.status(500).json({ msg: 'Server error' }));
});

// @route   GET api/nutrition/:userId
// @desc    Get all nutrition data for a user
router.get('/nutrition/:userId', (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user) return res.status(404).json({ msg: 'User not found' });
      res.json(user.nutrition);
    })
    .catch(() => res.status(500).json({ msg: 'Server error' }));
});

// @route   POST api/nutrition
// @desc    Add a new meal log for a user
router.post('/nutrition', (req, res) => {
  const { userId, mealType, description, balance } = req.body;
  User.findById(userId)
    .then(user => {
      user.nutrition.push({ mealType, description, balance, date: new Date() });
      user.save().then(updatedUser => res.json(updatedUser.nutrition));
    })
    .catch(() => res.status(404).json({ msg: 'User not found' }));
});
 // This line should be at the very end

export default router; // Changed from module.exports