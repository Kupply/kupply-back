// Base CustomError Class
export abstract class CustomError extends Error {
  abstract statusCode: number;
    
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
    
  abstract serializeErrors(): { message: string; field?: string }[];
};


// MessageNotFoundError Class : 메시지를 찾지 못한 경우
export class MessageNotFoundError extends CustomError {
  statusCode = 404;

  constructor(public messageId: string) {
    super(`Message not found: ${messageId}`);
    Object.setPrototypeOf(this, MessageNotFoundError.prototype);
  }

  serializeErrors() { 
    return [{ message: this.message }];
  }
};

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
};
