const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const app = express();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(express.json());

// Configure CORS to allow credentials
app.use(
  cors({
    origin: "https://ideas-collection-webapp.vercel.app",
    // origin: "http://localhost:5173",
    credentials: true, 
  })
);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    createDefaultAdminAndManager(); // Call the function to create the default admin user
  })
  .catch((err) => console.log(err));

// Schemas and Models
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  region: String,
  role: { type: String, enum: ["employee", "admin", "innovation_manager"], default: "employee" },
});

const ideaSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    votes: { type: Number, default: 0 },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    shortlisted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    category: { type: String, default: "General" },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    image: { type: String },
    isCollab: { type: Boolean, default: false },
    reviews: [
      {
        review: String,
        rating: { type: Number, min: 1, max: 5 },
        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true },
});

const User = mongoose.model("User", userSchema);
const Idea = mongoose.model("Idea", ideaSchema);
const Category = mongoose.model("Category", categorySchema);

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL, // Sender address
      to, // Receiver email
      subject, // Subject line
      text, // Email body
    });
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Error sending email:", err.message);
  }
};

// Function to create default admin user
// Function to create default admin and innovation manager users
const createDefaultAdminAndManager = async () => {
  const users = [
    { email: "admin@gmail.com", password: "12345", role: "admin", name: "Admin" },
    {
      email: "innovation_manager@gmail.com",
      password: "manager123",
      role: "innovation_manager",
      name: "Innovation Manager",
    },
  ];

  try {
    for (const user of users) {
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = new User({
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
        });
        await newUser.save();
        console.log(`${user.role} user created successfully.`);
      } else {
        console.log(`${user.role} user already exists.`);
      }
    }
  } catch (err) {
    console.error("Error creating default users:", err.message);
  }
};

// Multer configuration for handling image uploads
const upload = multer({ storage: multer.memoryStorage() });

// Authentication Middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Access denied");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(400).send("Invalid token");
  }
};

// Routes
app.post("/api/register", async (req, res) => {
  const { name, email, password, region } = req.body;

  if (!name || !email || !password || !region) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      region, // Save the region
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Invalid credentials");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/api/categories", authenticate, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).send("Access denied");

  const { name } = req.body;
  try {
    const category = new Category({ name });
    await category.save();
    res.status(201).send("Category added");
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/api/categories", authenticate, async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post(
  "/api/ideas/add",
  [authenticate, upload.single("image")],
  async (req, res) => {
    const { title, description, category, isCollab } = req.body;
    try {
      let imageUrl = "";

      // Upload image to Cloudinary if provided
      if (req.file) {
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "ideas" }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            })
            .end(req.file.buffer);
        });

        imageUrl = uploadResult.secure_url;
      }

      const idea = new Idea({
        title,
        description,
        category,
        image: imageUrl,
        submittedBy: req.user.id,
        isCollab: isCollab,
      });

      await idea.save();
      res.status(201).send("Idea submitted");
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);

app.put("/api/ideas/:id/collaborate", authenticate, async (req, res) => {
  try {
    // Check if the user is an employee
    if (req.user.role !== "employee") {
      return res.status(403).send("Only employees can collaborate on ideas");
    }

    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).send("Idea not found");

    if (!idea.isCollab)
      return res.status(400).send("Collaboration is not allowed for this idea");

    if (idea.status !== "approved")
      return res
        .status(400)
        .send("Collaboration is only allowed on approved ideas");

    if (!idea.collaborators.includes(req.user.id)) {
      idea.collaborators.push(req.user.id);
      await idea.save();
      res.status(200).send("Collaborated successfully");
    } else {
      res.status(400).send("Already a collaborator");
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put("/api/ideas/:id/edit", authenticate, async (req, res) => {
    try {
      const { title, description, category } = req.body;
  
      // Fetch the idea by ID and populate relevant fields
      const idea = await Idea.findById(req.params.id).populate("submittedBy").populate("collaborators");
      if (!idea) {
        return res.status(404).send("Idea not found");
      }
  
      // Check if the user is the owner or a collaborator
      const isOwner = String(idea.submittedBy._id) === req.user.id;
      const isCollaborator = idea.collaborators.some((collab) => String(collab._id) === req.user.id);
  
      if (!isOwner && !isCollaborator) {
        return res.status(403).send("Access denied. Only the owner or collaborators can edit this idea.");
      }
  
      // Update the idea fields
      if (title) idea.title = title;
      if (description) idea.description = description;
      if (category) idea.category = category;
  
      // Save the updated idea
      await idea.save();
  
      res.status(200).send({ message: "Idea updated successfully", idea });
    } catch (err) {
      console.error("Error editing idea:", err.message);
      res.status(500).send("An error occurred while updating the idea");
    }
  });
  
  

app.put("/api/ideas/:id/vote", authenticate, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).send("Idea not found");

    // Check if the user is the one who submitted the idea
    if (idea.submittedBy.toString() === req.user.id) {
      return res.status(400).send("You cannot vote on your own idea");
    }

    // Check if the user has already voted
    if (idea.voters.includes(req.user.id)) {
      return res.status(400).send("You have already voted for this idea");
    }

    // Add the user's vote
    idea.voters.push(req.user.id);
    idea.votes += 1;

    await idea.save();
    res.status(200).send("Vote registered successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/api/ideas", authenticate, async (req, res) => {
  try {
    const ideas = await Idea.find({ status: "approved" });
    res.status(200).json(ideas);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/api/ideas/:id", authenticate, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id).populate("submittedBy").populate("collaborators");
    if (!idea) return res.status(404).send("Idea not found");
    res.status(200).json(idea);
  } catch (err) {
    console.error("Error fetching single idea:", err.message);
    res.status(400).send("Failed to fetch idea");
  }
});

app.get("/api/admin/ideas", authenticate, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).send("Access denied");

  try {
    const ideas = await Idea.find().populate("submittedBy");
    res.status(200).json(ideas);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put("/api/admin/ideas/:id", authenticate, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).send("Access denied");

  try {
    const { status } = req.body;
    const idea = await Idea.findById(req.params.id).populate("submittedBy");

    if (!idea) return res.status(404).send("Idea not found");

    idea.status = status || idea.status;
    await idea.save();

    if (status === "approved") {
      const emailText = `Dear ${idea.submittedBy.name},\n\nYour idea titled "${idea.title}" has been approved. Thank you for your contribution!\n\nBest regards,\nAdmin Team`;
      await sendEmail(idea.submittedBy.email, "Idea Approved", emailText);
    } else if (status === "rejected") {
      const emailText = `Dear ${idea.submittedBy.name},\n\nYour idea titled "${idea.title}" has been rejected. Thank you for your contribution!\n\nBest regards,\nAdmin Team`;
      await sendEmail(idea.submittedBy.email, "Idea Rejected", emailText);
    }

    res.status(200).send({ message: "Idea updated and email sent", idea });
  } catch (err) {
    console.error("Error updating idea:", err.message);
    res.status(400).send(err.message);
  }
});

app.get("/api/manager/ideas", authenticate, async (req, res) => {
  if (req.user.role !== "innovation_manager") return res.status(403).send("Access denied");

  try {
    const ideas = await Idea.find({ status: "approved" }).populate("submittedBy");
    res.status(200).json(ideas);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put("/api/manager/ideas/:id/shortlist", authenticate, async (req, res) => {
  if (req.user.role !== "innovation_manager") {
    return res.status(403).send("Access denied");
  }

  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).send("Idea not found");

    // Update the shortlisted field
    idea.shortlisted = true;
    await idea.save();
    res.status(200).json({message: "Idea successfully shortlisted.", idea});
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/api/manager/ideas/:id/reward", authenticate, async (req, res) => {
  if (req.user.role !== "innovation_manager") {
    return res.status(403).send("Access denied");
  }

  const { review, rating } = req.body;

  try {
    const idea = await Idea.findById(req.params.id).populate("submittedBy");
    if (!idea) return res.status(404).send("Idea not found");

    // Check if the idea is shortlisted
    if (!idea.shortlisted) {
      return res.status(400).send("Cannot add review and rating to a non-shortlisted idea.");
    }

    // Add review and rating to the idea
    idea.reviews.push({
      review,
      rating,
      reviewedBy: req.user.id,
    });
    await idea.save();

    // Send reward email to the employee
    await sendEmail(
      idea.submittedBy.email,
      "Reward for Your Idea",
      `Congratulations! You have been rewarded for your idea: ${idea.title}. Review: ${review}, Rating: ${rating}`
    );

    res.status(200).send("Review and rating added, reward sent to employee.");
  } catch (err) {
    res.status(400).send(err.message);
  }
});



// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
