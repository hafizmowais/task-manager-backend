import { Task, TaskStatus } from './task.entity';

describe('Task Entity', () => {
  describe('create', () => {
    it('should create a new task with default status TODO', () => {
      const task = Task.create('1', 'Test Task', 'Test Description');

      expect(task.id).toBe('1');
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test Description');
      expect(task.status).toBe(TaskStatus.TODO);
      expect(task.assignedTo).toBeNull();
      expect(task.dueDate).toBeNull();
    });

    it('should create a task with due date', () => {
      const dueDate = new Date('2025-12-31');
      const task = Task.create('1', 'Test Task', 'Test Description', dueDate);

      expect(task.dueDate).toEqual(dueDate);
    });
  });

  describe('update', () => {
    it('should update task title and description', () => {
      const task = Task.create('1', 'Old Title', 'Old Description');
      
      task.update('New Title', 'New Description');

      expect(task.title).toBe('New Title');
      expect(task.description).toBe('New Description');
    });

    it('should update only provided fields', () => {
      const task = Task.create('1', 'Title', 'Description');
      
      task.update('New Title');

      expect(task.title).toBe('New Title');
      expect(task.description).toBe('Description');
    });
  });

  describe('assignTo', () => {
    it('should assign task to user', () => {
      const task = Task.create('1', 'Test Task', 'Test Description');
      
      task.assignTo('user-1');

      expect(task.assignedTo).toBe('user-1');
    });
  });

  describe('updateStatus', () => {
    it('should update task status', () => {
      const task = Task.create('1', 'Test Task', 'Test Description');
      
      task.updateStatus(TaskStatus.IN_PROGRESS);

      expect(task.status).toBe(TaskStatus.IN_PROGRESS);
    });
  });

  describe('isOverdue', () => {
    it('should return false if no due date', () => {
      const task = Task.create('1', 'Test Task', 'Test Description');
      
      expect(task.isOverdue()).toBe(false);
    });

    it('should return false if due date is in future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      
      const task = Task.create('1', 'Test Task', 'Test Description', futureDate);
      
      expect(task.isOverdue()).toBe(false);
    });

    it('should return true if due date is in past and status is not DONE', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 7);
      
      const task = Task.create('1', 'Test Task', 'Test Description', pastDate);
      
      expect(task.isOverdue()).toBe(true);
    });

    it('should return false if due date is in past but status is DONE', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 7);
      
      const task = Task.create('1', 'Test Task', 'Test Description', pastDate);
      task.updateStatus(TaskStatus.DONE);
      
      expect(task.isOverdue()).toBe(false);
    });
  });
});

