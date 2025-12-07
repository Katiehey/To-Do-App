const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { User, Task, Project } = require('../models');

dotenv.config();

const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  },
];

const projects = [
  {
    name: 'Work',
    description: 'Work-related tasks',
    color: '#EF4444',
    icon: 'briefcase',
    isDefault: false,
  },
  {
    name: 'Personal',
    description: 'Personal tasks and errands',
    color: '#3B82F6',
    icon: 'home',
    isDefault: true,
  },
  {
    name: 'Learning',
    description: 'Learning and development',
    color: '#10B981',
    icon: 'book',
    isDefault: false,
  },
];

const tasks = [
  {
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the new feature',
    priority: 'high',
    tags: ['documentation', 'work'],
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Review pull requests',
    description: 'Review and merge pending PRs',
    priority: 'medium',
    tags: ['code-review', 'work'],
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, vegetables',
    priority: 'low',
    tags: ['shopping', 'personal'],
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    console.log('🧹 Cleared existing data');

    // Create user
    const createdUsers = await User.create(users);
    console.log('✅ Users created');

    // Create projects
    const projectsWithUser = projects.map(project => ({
      ...project,
      user: createdUsers[0]._id,
    }));
    const createdProjects = await Project.create(projectsWithUser);
    console.log('✅ Projects created');

    // Create tasks
    const tasksWithUser = tasks.map((task, index) => ({
      ...task,
      user: createdUsers[0]._id,
      project: createdProjects[index % createdProjects.length]._id,
    }));
    await Task.create(tasksWithUser);
    console.log('✅ Tasks created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest credentials:');
    console.log('Email: john@example.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();