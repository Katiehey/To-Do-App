import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Context Imports
import { ProjectContext } from '../context/ProjectContext';
import { AuthContext } from '../context/AuthContext';
import { TaskProvider } from '../context/TaskContext';
import { NotificationProvider } from '../context/NotificationContext';
import { ThemeProvider } from '../context/ThemeContext';

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
  taskStatus: 'todo', // Match your backend field name
  priority: 'high',
};

export const mockAuthContext = {
  user: mockUser,
  loading: false,
  login: vi.fn(),
  logout: vi.fn(),
};

export const mockProjectContext = {
  projects: [{ _id: 'p1', name: 'Work Project', color: '#3B82F6' }],
  fetchProjects: vi.fn(),
  loading: false,
  selectedProject: null,
  setSelectedProject: vi.fn()
};

/**
 * --- VIEWPORT HELPER ---
 * Forces JSDOM to a specific width to trigger Tailwind's responsive classes (md:, lg:)
 */
export const setWindowSize = (width, height = 1080) => {
  Object.defineProperty(window, 'innerWidth', { 
    writable: true, 
    configurable: true, 
    value: width 
  });
  Object.defineProperty(window, 'innerHeight', { 
    writable: true, 
    configurable: true, 
    value: height 
  });
  window.dispatchEvent(new Event('resize'));
};

/**
 * --- PROVIDER WRAPPER ---
 */
const AllTheProviders = ({ children, authValue, projectValue }) => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthContext.Provider value={authValue || mockAuthContext}>
          <ProjectContext.Provider value={projectValue || mockProjectContext}>
            <ThemeProvider>
              {/* TaskProvider MUST wrap NotificationProvider 
                  because NotificationProvider calls useTask() */}
              <TaskProvider>
                <NotificationProvider>
                  {children}
                </NotificationProvider>
              </TaskProvider>
            </ThemeProvider>
          </ProjectContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

/**
 * --- RENDER WITH PROVIDERS ---
 */
const renderWithProviders = (ui, { 
  projectValue, 
  authValue, 
  desktop = true, 
  ...options 
} = {}) => {
  // Set viewport before rendering to ensure responsive elements are visible
  if (desktop) {
    setWindowSize(1280);
  } else {
    setWindowSize(375); // Standard mobile width
  }

  return render(ui, { 
    wrapper: (props) => (
      <AllTheProviders 
        {...props} 
        projectValue={projectValue} 
        authValue={authValue} 
      />
    ), 
    ...options 
  });
};

// Helper for repetitive typing tasks
export const typeIntoInput = async (element, text) => {
  const user = userEvent.setup();
  await user.type(element, text);
};

// Re-export everything from RTL so you can use screen, waitFor, etc.
export * from '@testing-library/react';
export { renderWithProviders, userEvent };