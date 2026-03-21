# DAIS Backend Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

### 3. Start MongoDB

Make sure MongoDB is running on `mongodb://localhost:27017`

### 4. Start the Server

```bash
npm run dev    # Development mode with nodemon
npm start      # Production mode
```

The server will start on `http://localhost:5000`

---

## Environment Variables Setup

### Essential Variables

#### Database

- `MONGO_URI` - MongoDB connection string (e.g., `mongodb://localhost:27017/dais`)
- `NODE_ENV` - Set to `development` or `production`

#### Server

- `PORT` - Server port (default: 5000)
- `BASE_URL` - Server base URL (e.g., `http://localhost:5000`)
- `API_URL` - API base URL (e.g., `http://localhost:5000/api/v1`)
- `FRONTEND_URL` - Frontend URL for email links (e.g., `http://localhost:3000`)

#### JWT & Authentication

- `JWT_SECRET_KEY` - Secret key for JWT signing (generate a strong random string)
- `JWT_EXPIRES_IN` - JWT expiration time (e.g., `7d`)
- `ACCESS_TOKEN_SECRET` - Access token secret
- `ACCESS_TOKEN_EXPIRES` - Access token expiration (e.g., `1h`)
- `REFRESH_TOKEN_SECRET` - Refresh token secret
- `REFRESH_TOKEN_EXPIRES` - Refresh token expiration (e.g., `7d`)

#### Email Service (Gmail)

- `EMAIL_USER` - Gmail account email
- `EMAIL_PASSWORD` - Gmail App Password (NOT your regular password)
- `EMAIL_FROM` - From address for emails
- `EMAIL` - Legacy email var (same as EMAIL_USER)

**To get Gmail App Password:**

1. Enable 2-Factor Authentication in Gmail
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Create a new App Password for "Mail" and "Windows Computer"
4. Use this generated password as `EMAIL_PASSWORD`

#### Inactivity Configuration

- `INACTIVITY_WARNING_DAYS` - Days until warning emails start (default: 60)
- `INACTIVITY_THRESHOLD_DAYS` - Days until inheritance triggers (default: 90)
- `INACTIVITY_REMINDER_INTERVAL_DAYS` - Days between reminders (default: 7)

#### Encryption

- `ENCRYPTION_ALGORITHM` - Algorithm used (default: AES-256-GCM)

#### Redis (Optional)

- `REDIS_HOST` - Redis server host
- `REDIS_PORT` - Redis server port

---

## API Endpoints

### Authentication (`/api/v1/auth`)

- `POST /register` - Register a new user
- `POST /login` - Log in a user
- `POST /logout` - Log out a user
- `POST /refresh-token` - Refresh access token
- `GET /verify-email/:token` - Verify email address
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:token` - Reset password

### Assets (`/api/v1/assets`)

- `POST /` - Create a new asset
- `GET /` - Get all user's assets
- `GET /:assetId` - Get specific asset
- `PUT /:assetId` - Update asset
- `DELETE /:assetId` - Delete asset
- `POST /:assetId/share` - Share asset with nominee
- `POST /:assetId/archive` - Archive asset

### Nominees (`/api/v1/nominees`)

- `POST /` - Add a new nominee
- `GET /` - Get all nominees
- `PUT /:nomineeId` - Update nominee
- `DELETE /:nomineeId` - Delete nominee
- `GET /:nomineeId/verify` - Verify nominee status

### Inactivity (`/api/v1/inactivity`)

- `GET /status` - Get inactivity status
- `POST /mark-active` - Mark user as active
- `GET /history` - Get inactivity history
- `POST /trigger` - Manually trigger inheritance

### Admin (`/api/v1/admin`)

- `GET /stats` - Get system statistics
- `GET /users` - Get user management data
- `GET /audit-logs` - Get audit logs
- `POST /config` - Update system configuration

---

## Example API Requests

### Register

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Create Asset (with Bearer Token)

```bash
curl -X POST http://localhost:5000/api/v1/assets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "social",
    "title": "Facebook Account",
    "description": "My personal Facebook account",
    "assetContent": "facebook_password_encrypted_data",
    "visibility": "on_death",
    "metadata": {
      "platform": "Facebook",
      "accountUsername": "john.doe"
    }
  }'
```

### Add Nominee

```bash
curl -X POST http://localhost:5000/api/v1/nominees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "relationship": "Sister",
    "phoneNumber": "1234567890"
  }'
```

---

## Cron Jobs

The system includes an automated inactivity scheduler that runs daily at 00:00 UTC:

### Inactivity Scheduler (`inactivityScheduler.js`)

- **Frequency**: Daily at 00:00 UTC
- **Function**: Checks all users for inactivity and sends notifications
- **Process**:
  1. Queries users inactive for 60+ days
  2. Sends warning emails
  3. Sends reminder emails every 7 days
  4. Triggers inheritance when threshold (90 days) is reached

### Manual Trigger

You can manually trigger the inactivity check:

```bash
POST /api/v1/inactivity/trigger
```

---

## Database Collections

### Users

- Stores user account information
- Email verification status
- Last active timestamp
- Password (hashed with bcrypt)

### Assets

- Encrypted digital assets
- Ownership and access control
- Visibility settings (private, nominee_only, on_death)

### Nominees

- Designated beneficiaries
- Verification status
- Relationship information

### InactivityCases

- Tracks inactivity per user
- Warning sent date
- Reminders sent
- Trigger status

### AuditLogs

- All system events logged
- User actions tracked
- Security events recorded

### VerificationEvents

- Email verification tracking
- Nominee verification tokens
- Inactivity notification tracking

---

## Security Features

1. **Password Security**
   - Bcrypt hashing with 12 salt rounds
   - Minimum 8 characters
   - Validation on registration

2. **Data Encryption**
   - AES-256-GCM for asset data
   - Random IV and auth tag for each encryption
   - Secure key generation

3. **Authentication**
   - JWT tokens with expiration
   - Access tokens (1 hour)
   - Refresh tokens (7 days)

4. **Authorization**
   - Role-based access control (user, admin)
   - User can only access their own data
   - Admin can access system statistics

5. **Audit Logging**
   - All sensitive operations logged
   - IP address tracking
   - User agent tracking

---

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running: `mongod`
- Check `MONGO_URI` in `.env`
- Verify MongoDB is on `localhost:27017`

### Email Not Sending

- Verify Gmail account credentials
- Use App Password, not regular password
- Enable 2-Factor Authentication on Gmail account
- Check email configuration in `.env`

### Token Expiration

- Access tokens expire after 1 hour
- Use refresh token to get new access token
- Refresh tokens expire after 7 days

### Inactivity Not Triggering

- Check server logs: `tail -f ./src/logs/error.log`
- Verify cron job running at 00:00 UTC
- Manually trigger: `POST /api/v1/inactivity/trigger`

---

## Development Tips

### Viewing Logs

```bash
# View real-time logs
tail -f src/logs/info.log
tail -f src/logs/error.log

# View all logs
cat src/logs/info.log | grep "query"
```

### Testing Without Frontend

Use Postman or curl to test endpoints directly

### Database Inspection

```bash
# MongoDB CLI
mongo
use dais
db.users.find()
db.assets.find()
```

---

## Production Deployment

### Before Deploying

1. **Update Environment Variables**
   - Use production MongoDB URI
   - Use production JWT secrets (strong random strings)
   - Use production email service
   - Set `NODE_ENV=production`

2. **Security**
   - Enable CORS with specific domains
   - Use HTTPS only
   - Implement rate limiting
   - Set secure cookie options

3. **Monitoring**
   - Set up error tracking (Sentry, etc.)
   - Enable performance monitoring
   - Set up log aggregation

4. **Database**
   - Set up MongoDB backups
   - Enable database authentication
   - Create indexes on frequently queried fields

### Deployment Commands

```bash
# Install dependencies
npm install

# Build/Prepare for production
npm run build  # if applicable

# Start server
NODE_ENV=production npm start
```

---

## Version Information

- **Node.js**: v16+
- **MongoDB**: v5+
- **Express**: 5.x
- **JWT**: 9.x
- **Bcrypt**: 6.x
- **AES-256-GCM**: Built-in Node.js crypto
