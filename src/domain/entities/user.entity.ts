/**
 * User Entity - Core business entity
 * Represents a user in the domain model
 */
export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  /**
   * Factory method to create a new user
   */
  static create(id: string, name: string, email: string): User {
    const now = new Date();
    return new User(id, name, email, now, now);
  }

  /**
   * Update user details
   */
  update(name?: string, email?: string): void {
    if (name !== undefined) {
      this.name = name;
    }
    if (email !== undefined) {
      this.email = email;
    }
    this.updatedAt = new Date();
  }

  /**
   * Validate email format
   */
  hasValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }
}

