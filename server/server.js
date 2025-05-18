import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/job-portal')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['candidate', 'admin'], default: 'candidate' },
  createdAt: { type: Date, default: Date.now }
});

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  salary: { type: String },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'] },
  category: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  deadline: { type: Date }
});

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: { type: String, required: true },
  coverLetter: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'reviewing', 'rejected', 'interview', 'hired'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Job = mongoose.model('Job', jobSchema);
const Application = mongoose.model('Application', applicationSchema);

// Authentication Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourDefaultSecretKey');
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new Error();
    }
    
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ message: 'Please authenticate' });
  }
};

// Admin Middleware
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).send({ message: 'Access denied: Admin rights required' });
      }
      next();
    });
  } catch (error) {
    res.status(401).send({ message: 'Please authenticate' });
  }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'candidate'
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'yourDefaultSecretKey',
      { expiresIn: '30d' }
    );
    
    res.status(201).send({ token });
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

app.post('/api/auth/admin/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new admin user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'yourDefaultSecretKey',
      { expiresIn: '30d' }
    );
    
    res.status(201).send({ token });
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email, role: 'candidate' });
    if (!user) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'yourDefaultSecretKey',
      { expiresIn: '30d' }
    );
    
    res.send({ token });
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'yourDefaultSecretKey',
      { expiresIn: '30d' }
    );
    
    res.send({ token });
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

// Job Routes
app.get('/api/jobs', async (req, res) => {
  try {
    const { q, location, category, type, sort } = req.query;
    
    const query = {};
    
    // Search query
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Job type filter
    if (type) {
      query.type = type;
    }
    
    // Sort options
    let sortOption = {};
    if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }
    
    const jobs = await Job.find(query)
      .sort(sortOption)
      .populate('postedBy', 'name')
      .exec();
    
    res.send(jobs);
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email')
      .exec();
    
    if (!job) {
      return res.status(404).send({ message: 'Job not found' });
    }
    
    res.send(job);
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

app.post('/api/jobs', adminAuth, async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      description,
      requirements,
      salary,
      type,
      category,
      deadline
    } = req.body;
    
    const job = new Job({
      title,
      company,
      location,
      description,
      requirements,
      salary,
      type,
      category,
      postedBy: req.user._id,
      deadline: deadline ? new Date(deadline) : undefined
    });
    
    await job.save();
    res.status(201).send(job);
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

app.patch('/api/jobs/:id', adminAuth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'company', 'location', 'description', 'requirements', 'salary', 'type', 'category', 'deadline'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).send({ message: 'Invalid updates' });
    }
    
    const job = await Job.findOne({ _id: req.params.id, postedBy: req.user._id });
    
    if (!job) {
      return res.status(404).send({ message: 'Job not found' });
    }
    
    updates.forEach(update => job[update] = req.body[update]);
    await job.save();
    
    res.send(job);
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

app.delete('/api/jobs/:id', adminAuth, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user._id });
    
    if (!job) {
      return res.status(404).send({ message: 'Job not found' });
    }
    
    // Delete associated applications
    await Application.deleteMany({ job: req.params.id });
    
    res.send({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

// Application Routes
app.post('/api/applications', auth, async (req, res) => {
  try {
    const { jobId, resume, coverLetter } = req.body;
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).send({ message: 'Job not found' });
    }
    
    // Check if user has already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user._id
    });
    
    if (existingApplication) {
      return res.status(400).send({ message: 'You have already applied for this job' });
    }
    
    const application = new Application({
      job: jobId,
      candidate: req.user._id,
      resume,
      coverLetter
    });
    
    await application.save();
    res.status(201).send(application);
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

app.get('/api/applications', auth, async (req, res) => {
  try {
    let applications;
    
    if (req.user.role === 'admin') {
      // Admins see applications for jobs they posted
      const jobsPosted = await Job.find({ postedBy: req.user._id }).select('_id');
      const jobIds = jobsPosted.map(job => job._id);
      
      applications = await Application.find({ job: { $in: jobIds } })
        .populate('job')
        .populate('candidate', 'name email')
        .sort({ createdAt: -1 })
        .exec();
    } else {
      // Candidates see their own applications
      applications = await Application.find({ candidate: req.user._id })
        .populate('job')
        .sort({ createdAt: -1 })
        .exec();
    }
    
    res.send(applications);
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

app.patch('/api/applications/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'reviewing', 'rejected', 'interview', 'hired'].includes(status)) {
      return res.status(400).send({ message: 'Invalid status' });
    }
    
    const application = await Application.findById(req.params.id)
      .populate('job')
      .exec();
    
    if (!application) {
      return res.status(404).send({ message: 'Application not found' });
    }
    
    // Verify that this admin posted the job
    const job = await Job.findOne({
      _id: application.job._id,
      postedBy: req.user._id
    });
    
    if (!job) {
      return res.status(403).send({ message: 'Not authorized to update this application' });
    }
    
    application.status = status;
    await application.save();
    
    res.send(application);
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});