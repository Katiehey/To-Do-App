const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { User, Task, Project } = require('../models');

dotenv.config();

const testModels = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test User Model
    console.log('\n📝 Testing User Model...');
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    
    const savedUser = await testUser.save();
    console.log('✅ User created:', savedUser.getPublicProfile());

    // Test Project Model
    console.log('\n📝 Testing Project Model...');
    const testProject = new Project({
      name: 'Personal Tasks',
      description: 'My personal to-do items',
      color: '#3B82F6',
      user: savedUser._id,
      isDefault: true,
    });
    
    const savedProject = await testProject.save();
    console.log('✅ Project created:', savedProject);

    // Test Task Model
    console.log('\n📝 Testing Task Model...');
    const testTask = new Task({
      title: 'Complete project setup',
      description: 'Finish all Pomodoro sessions',
      priority: 'high',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      tags: ['development', 'setup'],
      project: savedProject._id,
      user: savedUser._id,
      subtasks: [
        { title: 'Setup backend' },
        { title: 'Setup frontend' },
        { title: 'Setup database' },
      ],
    });
    
    const savedTask = await testTask.save();
    console.log('✅ Task created:', savedTask);

    // Test task methods
    console.log('\n📝 Testing Task Methods...');
    await savedTask.markCompleted();
    console.log('✅ Task marked as completed');

    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await User.findByIdAndDelete(savedUser._id);
    await Project.findByIdAndDelete(savedProject._id);
    await Task.findByIdAndDelete(savedTask._id);
    console.log('✅ Test data cleaned up');

    console.log('\n✅ All model tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing models:', error);
    process.exit(1);
  }
};

testModels();