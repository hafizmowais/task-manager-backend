/**
 * Task Entity - Core business entity
 * Represents a task in the domain model
 */
export class Task {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public status: TaskStatus,
    public dueDate: Date | null,
    public assignedTo: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  /**
   * Factory method to create a new task
   */
  static create(
    id: string,
    title: string,
    description: string,
    dueDate: Date | null = null,
  ): Task {
    const now = new Date();
    return new Task(
      id,
      title,
      description,
      TaskStatus.TODO,
      dueDate,
      null,
      now,
      now,
    );
  }

  /**
   * Update task details
   */
  update(title?: string, description?: string, dueDate?: Date | null): void {
    if (title !== undefined) {
      this.title = title;
    }
    if (description !== undefined) {
      this.description = description;
    }
    if (dueDate !== undefined) {
      this.dueDate = dueDate;
    }
    this.updatedAt = new Date();
  }

  /**
   * Assign task to a user
   */
  assignTo(userId: string): void {
    this.assignedTo = userId;
    this.updatedAt = new Date();
  }

  /**
   * Update task status
   */
  updateStatus(status: TaskStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  /**
   * Check if task is overdue
   */
  isOverdue(): boolean {
    if (!this.dueDate) {
      return false;
    }
    return this.dueDate < new Date() && this.status !== TaskStatus.DONE;
  }
}

/**
 * Task Status Value Object
 */
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

