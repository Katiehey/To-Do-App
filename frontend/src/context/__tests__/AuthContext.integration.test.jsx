import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import api from '../../services/api';

// Mock the axios instance (api.js)
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));

describe('AuthContext Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const wrapper = ({ children }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  describe('Initial Auth Check', () => {
    it('sets loading to false if no token is found', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.user).toBeNull();
    });

    it('authenticates automatically if a valid token exists', async () => {
      const mockUser = { _id: '123', name: 'Test User' };
      localStorage.setItem('token', 'valid-token');
      
      api.get.mockResolvedValue({
        data: { data: { user: mockUser } }
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('Login Flow', () => {
    it('successfully logs in and stores token', async () => {
      const mockData = { user: { name: 'Admin' }, token: 'secret-token' };
      api.post.mockResolvedValue({
        data: { data: mockData }
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      let response;
      await act(async () => {
        response = await result.current.login('test@test.com', 'password');
      });

      expect(response.success).toBe(true);
      expect(result.current.user.name).toBe('Admin');
      expect(localStorage.getItem('token')).toBe('secret-token');
    });

    it('returns error message on login failure', async () => {
      api.post.mockRejectedValue({
        response: { data: { message: 'Invalid credentials' } }
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      let response;
      await act(async () => {
        response = await result.current.login('wrong@test.com', 'wrong');
      });

      expect(response.success).toBe(false);
      expect(response.error).toBe('Invalid credentials');
      expect(result.current.user).toBeNull();
    });
  });

  describe('Registration Flow', () => {
    it('registers a new user and logs them in', async () => {
      const mockData = { user: { name: 'New User' }, token: 'reg-token' };
      api.post.mockResolvedValue({
        data: { data: mockData }
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.register('New User', 'new@test.com', 'password');
      });

      expect(result.current.user.name).toBe('New User');
      expect(localStorage.getItem('token')).toBe('reg-token');
    });
  });

  describe('Logout Flow', () => {
    it('removes all auth data on logout', async () => {
      localStorage.setItem('token', 'active-token');
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});