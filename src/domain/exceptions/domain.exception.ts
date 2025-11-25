/**
 * Base domain exception
 */
export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Entity not found exception
 */
export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, id: string) {
    super(`${entityName} with id ${id} not found`);
  }
}

/**
 * Invalid operation exception
 */
export class InvalidOperationException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Validation exception
 */
export class ValidationException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}

