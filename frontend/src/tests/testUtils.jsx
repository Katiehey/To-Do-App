import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
// Import your real providers here (adjust paths to your project)
// import { AuthProvider } from '@/context/AuthContext';
// import { TaskProvider } from '@/context/TaskContext';

/**
 * --- MOCK DATA ---
 */
export const mockUser = {
  id: 'user-123',
  name: 'Test Admin',
  email: 'admin@test.com',
};

export const mockTask = {
  _id: 'task-1',
  title: 'Complete Unit Tests',
  tags: ['work', 'urgent'],
  description: 'Write utilities for the frontend',
  status: 'todo',
  priority: 'high',
};

export const mockProject = {
  _id: 'proj-1',
  name: 'Taskmaster Pro Launch',
  color: '#4f46e5',
};

/**
 * --- HELPER FUNCTIONS ---
 */
export const createMockTasks = (count) => 
  Array.from({ length: count }, (_, i) => ({
    ...mockTask,
    _id: `task-${i}`,
    title: `Task ${i}`
  }));

export const typeIntoInput = async (element, text) => {
  const user = userEvent.setup();
  await user.type(element, text);
};

/**
 * --- RENDER WITH PROVIDERS ---
 * This wraps your component in all necessary Contexts/Routers
 */
const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      {/* Wrap with your actual Context Providers here. 
          Example:
          <AuthProvider value={{ user: mockUser }}>
            <TaskProvider>
              {children}
            </TaskProvider>
          </AuthProvider>
      */}
      {children}
    </BrowserRouter>
  );
};

const renderWithProviders = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from RTL
export * from '@testing-library/react';
// Override render method
export { renderWithProviders, userEvent };