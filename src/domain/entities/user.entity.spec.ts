import { User } from './user.entity';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a new user', () => {
      const user = User.create('1', 'John Doe', 'john@example.com');

      expect(user.id).toBe('1');
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
    });
  });

  describe('update', () => {
    it('should update user name and email', () => {
      const user = User.create('1', 'John Doe', 'john@example.com');
      
      user.update('Jane Doe', 'jane@example.com');

      expect(user.name).toBe('Jane Doe');
      expect(user.email).toBe('jane@example.com');
    });

    it('should update only provided fields', () => {
      const user = User.create('1', 'John Doe', 'john@example.com');
      
      user.update('Jane Doe');

      expect(user.name).toBe('Jane Doe');
      expect(user.email).toBe('john@example.com');
    });
  });

  describe('hasValidEmail', () => {
    it('should return true for valid email', () => {
      const user = User.create('1', 'John Doe', 'john@example.com');
      
      expect(user.hasValidEmail()).toBe(true);
    });

    it('should return false for invalid email', () => {
      const user = User.create('1', 'John Doe', 'invalid-email');
      
      expect(user.hasValidEmail()).toBe(false);
    });
  });
});

