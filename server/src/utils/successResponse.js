// Custom Success Response Class
export class SuccessResponse {
  constructor(data = null, message = 'Success', statusCode = 200) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      timestamp: this.timestamp
    };
  }
}

// Specific Success Response Classes
export class CreatedResponse extends SuccessResponse {
  constructor(data = null, message = 'Resource created successfully') {
    super(data, message, 201);
  }
}

export class OkResponse extends SuccessResponse {
  constructor(data = null, message = 'Request successful') {
    super(data, message, 200);
  }
}

export class NoContentResponse extends SuccessResponse {
  constructor(message = 'Request successful') {
    super(null, message, 204);
  }
}

// Pagination Response
export class PaginatedResponse extends SuccessResponse {
  constructor(data = [], message = 'Data retrieved successfully', pagination = {}) {
    super(data, message, 200);
    this.pagination = {
      total: pagination.total || 0,
      count: pagination.count || data.length,
      currentPage: pagination.currentPage || 1,
      totalPages: pagination.totalPages || 1,
      ...pagination
    };
  }

  toJSON() {
    return {
      ...super.toJSON(),
      pagination: this.pagination
    };
  }
}
