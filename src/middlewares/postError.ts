// Base CustomError Class
export abstract class CustomError extends Error {
  abstract statusCode: number;
  
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
  
  abstract serializeErrors(): { message: string; field?: string }[];
}
  
// PostNotFoundError Class : 포스트를 찾지 못한 경우
export class PostNotFoundError extends CustomError {
  statusCode = 404;
  
  constructor(public postId: string) {
    super(`Post not found: ${postId}`);
    Object.setPrototypeOf(this, PostNotFoundError.prototype);
  }
  
  serializeErrors() {
    return [{ message: this.message }];
  }
}
  
// PostValidationError Class : 유효하지 않은 포스트 데이터를 받은 경우
export class PostValidationError extends CustomError {
  statusCode = 400;
  
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, PostValidationError.prototype);
  }
  
  serializeErrors() {
    return [{ message: this.message }];
  }
}
  
// AuthenticationError Class : 인증되지 않은 사용자의 요청을 받은 경우
export class AuthenticationError extends CustomError {
  statusCode = 401;
  
  constructor() {
    super('Not authenticated');
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
  
  serializeErrors() {
    return [{ message: 'Not authenticated' }];
  }
}
  