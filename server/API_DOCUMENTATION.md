# DAIS API Documentation

## Base URL

```
http://localhost:5000/api/v1
```

---

## Authentication Endpoints

### 1. Register User

**Endpoint**: `POST /auth/register`

**Description**: Register a new user account

**Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response** (201):

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "message": "Verification email sent. Please check your email."
  },
  "timestamp": "2025-03-21T10:30:00.000Z"
}
```

---

### 2. Login User

**Endpoint**: `POST /auth/login`

**Description**: Authenticate user and receive tokens

**Request Body**:

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "timestamp": "2025-03-21T10:30:00.000Z"
}
```

---

### 3. Logout User

**Endpoint**: `POST /auth/logout`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logout successful",
  "data": {
    "message": "Logged out successfully"
  },
  "timestamp": "2025-03-21T10:30:00.000Z"
}
```

---

### 4. Refresh Token

**Endpoint**: `POST /auth/refresh-token`

**Request Body**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "timestamp": "2025-03-21T10:30:00.000Z"
}
```

---

### 5. Verify Email

**Endpoint**: `GET /auth/verify-email/:token`

**Description**: Verify user's email address

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Email verified successfully",
  "data": {
    "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "john@example.com",
    "message": "Email verified successfully"
  },
  "timestamp": "2025-03-21T10:30:00.000Z"
}
```

---

### 6. Forgot Password

**Endpoint**: `POST /auth/forgot-password`

**Request Body**:

```json
{
  "email": "john@example.com"
}
```

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password reset email sent",
  "data": {
    "message": "If email exists, password reset link will be sent"
  },
  "timestamp": "2025-03-21T10:30:00.000Z"
}
```

---

### 7. Reset Password

**Endpoint**: `POST /auth/reset-password/:token`

**Request Body**:

```json
{
  "newPassword": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password reset successfully",
  "data": {
    "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "john@example.com",
    "message": "Password reset successfully"
  },
  "timestamp": "2025-03-21T10:30:00.000Z"
}
```

---

## Asset Endpoints

### 1. Create Asset

**Endpoint**: `POST /assets`

**Headers**:

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body**:

```json
{
  "type": "social",
  "title": "Facebook Account",
  "description": "My personal Facebook account",
  "assetContent": "encrypted_password_data",
  "visibility": "on_death",
  "metadata": {
    "platform": "Facebook",
    "accountUsername": "john.doe",
    "category": "social_media",
    "tags": ["social", "personal"]
  },
  "accessibleTo": ["65a1b2c3d4e5f6g7h8i9j0k2"],
  "expiryDate": "2026-03-21T00:00:00.000Z"
}
```

**Response** (201):

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Asset created successfully",
  "data": {
    "assetId": "65a1b2c3d4e5f6g7h8i9j0k3",
    "type": "social",
    "title": "Facebook Account",
    "description": "My personal Facebook account",
    "visibility": "on_death",
    "status": "active",
    "createdAt": "2025-03-21T10:30:00.000Z",
    "message": "Asset created successfully"
  },
  "timestamp": "2025-03-21T10:30:00.000Z"
}
```

---

### 2. Get All Assets

**Endpoint**: `GET /assets?type=social&visibility=on_death`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Query Parameters**:

- `type` (optional): Filter by type (social, subscription, confidential_note, crypto, other)
- `visibility` (optional): Filter by visibility (private, nominee_only, on_death)

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Assets retrieved successfully",
  "data": {
    "count": 3,
    "assets": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
        "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
        "type": "social",
        "title": "Facebook Account",
        "description": "My personal Facebook account",
        "visibility": "on_death",
        "status": "active",
        "isShared": false,
        "createdAt": "2025-03-21T10:30:00.000Z",
        "updatedAt": "2025-03-21T10:30:00.000Z"
      }
    ]
  },
  "timestamp": "2025-03-21T10:30:00.000Z"
}
```

---

### 3. Get Asset by ID

**Endpoint**: `GET /assets/:assetId`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Asset retrieved successfully",
  "data": {
    "assetId": "65a1b2c3d4e5f6g7h8i9j0k3",
    "type": "social",
    "title": "Facebook Account",
    "description": "My personal Facebook account",
    "metadata": {
      "platform": "Facebook",
      "accountUsername": "john.doe"
    },
    "visibility": "on_death",
    "accessibleTo": ["65a1b2c3d4e5f6g7h8i9j0k2"],
    "expiryDate": null,
    "status": "active",
    "isShared": false,
    "createdAt": "2025-03-21T10:30:00.000Z",
    "updatedAt": "2025-03-21T10:30:00.000Z"
  },
  "timestamp": "2025-03-21T10:30:00.000Z"
}
```

---

### 4. Update Asset

**Endpoint**: `PUT /assets/:assetId`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Request Body** (partial update):

```json
{
  "title": "Updated Facebook Account",
  "description": "My updated description",
  "visibility": "nominee_only",
  "metadata": {
    "accountUsername": "john.doe.updated"
  }
}
```

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Asset updated successfully",
  "data": {
    "assetId": "65a1b2c3d4e5f6g7h8i9j0k3",
    "type": "social",
    "title": "Updated Facebook Account",
    "description": "My updated description",
    "visibility": "nominee_only",
    "status": "active",
    "updatedAt": "2025-03-21T10:35:00.000Z",
    "message": "Asset updated successfully"
  },
  "timestamp": "2025-03-21T10:35:00.000Z"
}
```

---

### 5. Delete Asset

**Endpoint**: `DELETE /assets/:assetId`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Asset deleted successfully",
  "data": {
    "assetId": "65a1b2c3d4e5f6g7h8i9j0k3",
    "message": "Asset deleted successfully"
  },
  "timestamp": "2025-03-21T10:35:00.000Z"
}
```

---

### 6. Share Asset

**Endpoint**: `POST /assets/:assetId/share`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Request Body**:

```json
{
  "nomineeId": "65a1b2c3d4e5f6g7h8i9j0k2"
}
```

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Asset shared successfully",
  "data": {
    "assetId": "65a1b2c3d4e5f6g7h8i9j0k3",
    "isShared": true,
    "message": "Asset shared successfully"
  },
  "timestamp": "2025-03-21T10:35:00.000Z"
}
```

---

### 7. Archive Asset

**Endpoint**: `POST /assets/:assetId/archive`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Asset archived successfully",
  "data": {
    "assetId": "65a1b2c3d4e5f6g7h8i9j0k3",
    "status": "archived",
    "message": "Asset archived successfully"
  },
  "timestamp": "2025-03-21T10:35:00.000Z"
}
```

---

## Nominee Endpoints

### 1. Add Nominee

**Endpoint**: `POST /nominees`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Request Body**:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "relationship": "Sister",
  "phoneNumber": "1234567890",
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "postalCode": "62701",
    "country": "USA"
  }
}
```

**Response** (201):

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Nominee added successfully",
  "data": {
    "nomineeId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "relationship": "Sister",
    "verificationStatus": "pending",
    "createdAt": "2025-03-21T10:30:00.000Z",
    "message": "Nominee added. Verification email sent."
  },
  "timestamp": "2025-03-21T10:30:00.000Z"
}
```

---

### 2. Get All Nominees

**Endpoint**: `GET /nominees`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Nominees retrieved successfully",
  "data": {
    "count": 2,
    "nominees": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "relationship": "Sister",
        "verificationStatus": "verified",
        "verificationDate": "2025-03-21T11:00:00.000Z",
        "createdAt": "2025-03-21T10:30:00.000Z"
      }
    ]
  },
  "timestamp": "2025-03-21T10:30:00.000Z"
}
```

---

### 3. Update Nominee

**Endpoint**: `PUT /nominees/:nomineeId`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Request Body**:

```json
{
  "relationship": "Best Friend",
  "phoneNumber": "0987654321"
}
```

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Nominee updated successfully",
  "data": {
    "nomineeId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "relationship": "Best Friend",
    "verificationStatus": "verified",
    "updatedAt": "2025-03-21T10:35:00.000Z",
    "message": "Nominee updated successfully"
  },
  "timestamp": "2025-03-21T10:35:00.000Z"
}
```

---

### 4. Delete Nominee

**Endpoint**: `DELETE /nominees/:nomineeId`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Nominee deleted successfully",
  "data": {
    "nomineeId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "message": "Nominee deleted successfully"
  },
  "timestamp": "2025-03-21T10:35:00.000Z"
}
```

---

### 5. Verify Nominee

**Endpoint**: `GET /nominees/:nomineeId/verify?token=<verificationToken>`

**Query Parameters**:

- `token` (required): Email verification token

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Nominee verified successfully",
  "data": {
    "nomineeId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "verificationStatus": "verified",
    "message": "Nominee verified successfully"
  },
  "timestamp": "2025-03-21T10:35:00.000Z"
}
```

---

## Inactivity Endpoints

### 1. Get Inactivity Status

**Endpoint**: `GET /inactivity/status`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Inactivity status retrieved successfully",
  "data": {
    "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "lastActive": "2025-03-15T10:30:00.000Z",
    "inactiveDays": 6,
    "isActive": true,
    "caseExists": false,
    "caseState": "none",
    "thresholdDays": 90
  },
  "timestamp": "2025-03-21T10:30:00.000Z"
}
```

---

### 2. Mark User Active

**Endpoint**: `POST /inactivity/mark-active`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User marked as active successfully",
  "data": {
    "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "lastActive": "2025-03-21T10:35:00.000Z",
    "message": "User marked as active"
  },
  "timestamp": "2025-03-21T10:35:00.000Z"
}
```

---

### 3. Get Inactivity History

**Endpoint**: `GET /inactivity/history`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Inactivity history retrieved successfully",
  "data": {
    "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "count": 1,
    "history": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
        "state": "monitoring",
        "inactiveDays": 0,
        "thresholdDays": 90,
        "createdAt": "2025-03-21T00:00:00.000Z",
        "updatedAt": "2025-03-21T10:30:00.000Z"
      }
    ]
  },
  "timestamp": "2025-03-21T10:30:00.000Z"
}
```

---

### 4. Trigger Inheritance Manually

**Endpoint**: `POST /inactivity/trigger`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Inheritance triggered successfully",
  "data": {
    "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "nomineesNotified": 2,
    "assetsAccessible": 5,
    "message": "Inheritance triggered and nominees notified"
  },
  "timestamp": "2025-03-21T10:35:00.000Z"
}
```

---

## Admin Endpoints

All admin endpoints require `Authorization: Bearer <accessToken>` header where the token must be from a user with `role: "admin"`.

### 1. Get System Statistics

**Endpoint**: `GET /admin/stats`

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "System statistics retrieved successfully",
  "data": {
    "totalUsers": 150,
    "totalAssets": 500,
    "totalNominees": 200,
    "activeInactivityCases": 45,
    "triggeredCases": 5,
    "totalAuditLogs": 5000,
    "totalVerificationEvents": 1200,
    "last30Days": {
      "newUsers": 25,
      "newAssets": 120,
      "criticalEvents": 3
    }
  },
  "timestamp": "2025-03-21T10:30:00.000Z"
}
```

---

### 2. Get User Management Data

**Endpoint**: `GET /admin/users?status=active&role=user&page=1&limit=20`

**Query Parameters**:

- `status` (optional): Filter by status (active, inactive, suspended)
- `role` (optional): Filter by role (user, admin)
- `search` (optional): Search by email or name
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 20)

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User management data retrieved successfully",
  "data": {
    "users": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "role": "user",
        "status": "active",
        "assetCount": 5,
        "nomineeCount": 2,
        "inactiveDays": 3,
        "createdAt": "2025-02-20T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  },
  "timestamp": "2025-03-21T10:30:00.000Z"
}
```

---

### 3. Get Audit Logs

**Endpoint**: `GET /admin/audit-logs?severity=critical&page=1&limit=50`

**Query Parameters**:

- `eventType` (optional): Filter by event type
- `severity` (optional): Filter by severity (info, warning, critical)
- `userId` (optional): Filter by user ID
- `startDate` (optional): Start date filter
- `endDate` (optional): End date filter
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 50)

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Audit logs retrieved successfully",
  "data": {
    "logs": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
        "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
        "eventType": "LOGIN",
        "severity": "info",
        "description": "User logged in successfully",
        "ipAddress": "192.168.1.1",
        "timestamp": "2025-03-21T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 500,
      "pages": 10
    }
  },
  "timestamp": "2025-03-21T10:30:00.000Z"
}
```

---

### 4. System Configuration

**Endpoint**: `GET /admin/config` or `POST /admin/config`

**GET Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "System configuration retrieved successfully",
  "data": {
    "inactivityThresholdDays": 90,
    "firstWarningDays": 60,
    "reminderIntervalDays": 7,
    "tokenExpiryHours": 1,
    "refreshTokenExpiryDays": 7,
    "encryptionAlgorithm": "AES-256-GCM",
    "sessionTimeout": 30
  },
  "timestamp": "2025-03-21T10:30:00.000Z"
}
```

**POST Request Body**:

```json
{
  "inactivityThresholdDays": 90,
  "firstWarningDays": 60,
  "reminderIntervalDays": 7
}
```

**POST Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "System configuration updated successfully",
  "data": {
    "config": {
      "inactivityThresholdDays": 90,
      "firstWarningDays": 60,
      "reminderIntervalDays": 7,
      "tokenExpiryHours": 1,
      "refreshTokenExpiryDays": 7,
      "encryptionAlgorithm": "AES-256-GCM",
      "sessionTimeout": 30
    },
    "message": "System configuration updated successfully"
  },
  "timestamp": "2025-03-21T10:30:00.000Z"
}
```

---

## Error Responses

### Validation Error (400)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "statusCode": 400,
    "timestamp": "2025-03-21T10:30:00.000Z"
  }
}
```

### Authentication Error (401)

```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Not authenticated",
    "statusCode": 401,
    "timestamp": "2025-03-21T10:30:00.000Z"
  }
}
```

### Authorization Error (403)

```json
{
  "success": false,
  "error": {
    "code": "AUTHORIZATION_ERROR",
    "message": "Not authorized",
    "statusCode": 403,
    "timestamp": "2025-03-21T10:30:00.000Z"
  }
}
```

### Not Found Error (404)

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "statusCode": 404,
    "timestamp": "2025-03-21T10:30:00.000Z"
  }
}
```

### Conflict Error (409)

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Conflict occurred",
    "statusCode": 409,
    "timestamp": "2025-03-21T10:30:00.000Z"
  }
}
```

### Server Error (500)

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Internal server error",
    "statusCode": 500,
    "timestamp": "2025-03-21T10:30:00.000Z"
  }
}
```

---

## Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 204  | No Content            |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 500  | Internal Server Error |

---

## Authentication

All protected endpoints require the `Authorization` header with a Bearer token:

```
Authorization: Bearer <access_token>
```

Access tokens are obtained from the login endpoint and expire in 1 hour. Use the refresh token to get a new access token.

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- Default: 100 requests per 15 minutes per IP
- Login: 5 attempts per 15 minutes

---

## CORS

CORS is enabled for the specified frontend URL. Update `FRONTEND_URL` in environment variables to allow requests from your frontend.
