// GET all users (for admin)
router.get("/users", async (req, res) => {
    try {
      const users = await User.find({}, "name email role"); // only fetch necessary fields
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch users", error: err.message });
    }
  });
  