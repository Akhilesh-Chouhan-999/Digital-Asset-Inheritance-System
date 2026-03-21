# 🚀 DAIS - Complete Quick Start Guide

## Digital Asset Inheritance System - Full Stack Setup

### ✅ What You Have

**Backend** (Node.js/Express/MongoDB) ✓ COMPLETE

- 27 API endpoints fully implemented
- Authentication with JWT & email verification
- Asset encryption with AES-256-GCM
- Inactivity monitoring with daily scheduler
- Comprehensive audit logging
- Admin dashboard with statistics
- Email notification system

**Frontend** (React/Vite) ✓ COMPLETE

- Modern, interactive UI with Tailwind-inspired styling
- Easy authentication (register, login, password reset)
- Asset management dashboard
- Nominee/beneficiary management
- Activity status monitoring
- Admin panel for system stats
- Responsive design (desktop, tablet, mobile)
- Professional styling with CSS variables

---

## 🛠️ Complete Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- MongoDB (local or Atlas cloud)
- Gmail account (for email notifications, optional)
- Git

---

## 📦 Part 1: Backend Setup (Port 5000)

### Step 1: Navigate to Server Directory

```bash
cd server
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `server/.env`:

```env
# Database
MONGO_URI=mongodb://localhost:27017/dais
# OR use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dais

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your-random-secret-here-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-here-min-32-chars

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-google-app-password  # NOT regular password, use App Password

# API URLs
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Port
PORT=5000
```

### Step 4: Setup MongoDB

**Option A: Local MongoDB**

```bash
# Install MongoDB Community Edition
# Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB
mongod

# In another terminal, verify:
mongosh
```

**Option B: MongoDB Atlas (Cloud)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Add to .env as MONGO_URI

### Step 5: Start Backend Server

```bash
npm run dev
```

Expected output:

```
✓ Database connected
✓ Inactivity scheduler started
✓ Server running on http://localhost:5000
```

### Test Backend

```bash
# In another terminal:
curl http://localhost:5000/api/v1/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123"}'
```

---

## 🎨 Part 2: Frontend Setup (Port 3000)

### Step 1: Navigate to Client Directory (In New Terminal)

```bash
cd client
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

```bash
cp .env.example .env
```

The `.env` file should have:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_FRONTEND_URL=http://localhost:3000
```

### Step 4: Start Frontend Development Server

```bash
npm run dev
```

Expected output:

```
  VITE v5.0.8  ready in 123 ms

  ➜  Local:   http://localhost:3000/
```

---

## 🧪 Step 3: Test the Complete Application

### 1. Open Browser

Go to http://localhost:3000

### 2. Register Account

- Click "Create account"
- Fill in: Name, Email, Password
- Click "Create Account"
- ✓ Account created successfully

### 3. Login

- Use the email and password you just created
- ✓ Logged in successfully

### 4. Create Digital Asset

- Click "New Asset" on Dashboard
- Fill in:
  - Title: "My Bank Password"
  - Type: "Password"
  - Visibility: "On Death"
  - Content: "BankPassword123!"
- Click "Create Asset"
- ✓ Asset created and encrypted

### 5. Add Nominee

- Click "Nominees"
- Click "Add Nominee"
- Fill in:
  - Name: "John Doe"
  - Email: "john@example.com"
  - Relationship: "Spouse"
- Click "Add Nominee"
- ✓ Nominee added successfully

### 6. Share Asset with Nominee

- Click "Nominees"
- Click "Share Assets"
- Select the asset you created
- Click "Share Selected"
- ✓ Asset shared with nominee

### 7. Monitor Inactivity

- Click "Activity Status"
- See the inactivity timeline
- Click "Mark as Active" to update status
- ✓ Activity tracking works

### 8. Admin Panel (Admin Users Only)

- As an admin user, click "Admin Panel"
- See system statistics
- View all users and audit logs
- ✓ Admin features working

---

## 📊 Application Architecture

```
┌─────────────┐
│   Browser   │
│  (React)    │
│  Port 3000  │
└──────┬──────┘
       │ HTTP
       │ REST API
       ↓
┌──────────────────┐         ┌──────────────┐
│ Node.js/Express  │◄────────┤  MongoDB     │
│ Backend API      │         │  Database    │
│ Port 5000        │         └──────────────┘
└──────────────────┘
       │
       ├─→ JWT Authentication
       ├─→ Asset Encryption
       ├─→ Email Notifications
       ├─→ Inactivity Scheduler
       └─→ Audit Logging
```

---

## 🔐 Key Features to Test

### 1. Authentication

- ✅ Register with email verification
- ✅ Login with JWT tokens
- ✅ Automatic token refresh
- ✅ Logout functionality

### 2. Asset Management

- ✅ Create encrypted assets
- ✅ View all assets
- ✅ Edit asset details
- ✅ Delete assets (soft delete)
- ✅ Share assets with nominees
- ✅ Archive assets

### 3. Nominee Management

- ✅ Add beneficiaries
- ✅ Update nominee info
- ✅ Delete nominees
- ✅ Verify nominees
- ✅ Check nominee status

### 4. Inactivity Monitoring

- ✅ View account activity status
- ✅ See inactivity timeline
- ✅ Mark account as active
- ✅ View history
- ✅ Get warning notifications (at 60 days)

### 5. Admin Features

- ✅ View system statistics
- ✅ User management
- ✅ Audit log viewing
- ✅ System configuration

---

## 🚢 Production Deployment

### Frontend Deployment

**Build for Production**

```bash
cd client
npm run build
```

Creates optimized `dist` folder.

**Deploy to Vercel (Recommended)**

```bash
npm install -g vercel
vercel
```

**Deploy to Netlify**

- Connect GitHub repo
- Build command: `npm run build`
- Publish directory: `dist`

**Deploy to AWS S3**

```bash
npm run build
# Upload dist/ to S3 bucket
# Set up CloudFront for CDN
```

### Backend Deployment

**Option 1: Heroku** (Easiest)

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URI=your-mongo-uri
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

**Option 2: AWS EC2**

- Launch EC2 instance
- SSH into instance
- Clone repository
- Install Node.js and MongoDB
- Run: `npm install` && `npm start`
- Configure security groups
- Set up domain with Route53

**Option 3: DigitalOcean**

- Create droplet
- SSH in
- Install Node.js and MongoDB
- Deploy same as EC2
- Configure firewall rules

**Option 4: Railway/Render**

- Connect GitHub repository
- Set environment variables
- Auto-deploys on push

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed**

```bash
# Check MongoDB is running
# Windows: services.msc → find MongoDB
# Mac: brew services list
# Linux: sudo systemctl status mongod

# Or use MongoDB Atlas (cloud)
```

**Port 5000 Already in Use**

```bash
# Kill process using port 5000
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000
```

**Email Not Sending**

```bash
# Use Gmail App Password (not regular password)
# Enable 2FA on Gmail
# Generate App Password in Google Account settings
```

### Frontend Issues

**Cannot Connect to Backend**

- Ensure backend is running on port 5000
- Check VITE_API_URL in .env file
- Check browser console (F12) for errors

**Styles Not Loading**

- Clear browser cache: Ctrl+Shift+Delete
- Restart dev server
- Hard refresh: Ctrl+Shift+R

**Login Issues**

- Ensure backend is running
- Check email verification completed
- Check browser console for error messages

---

## 📚 Documentation Files

- **Backend Setup** - `/server/SETUP.md`
- **API Reference** - `/server/API_DOCUMENTATION.md`
- **Frontend README** - `/client/README.md`
- **Project Overview** - `/README.md`

---

## 🎯 Next Steps

### Phase 1: Testing (You are here)

- ✅ Both frontend and backend running
- ✅ Can register and login
- ✅ Can create and manage assets
- ✅ Can manage nominees
- ✅ Inactivity tracking works

### Phase 2: Customization

- [ ] Customize colors and branding
- [ ] Add more asset types
- [ ] Customize email templates
- [ ] Adjust inactivity thresholds

### Phase 3: Deployment

- [ ] Deploy backend to cloud
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Configure custom domain
- [ ] Set up SSL certificates
- [ ] Enable analytics
- [ ] Set up monitoring and alerts

### Phase 4: Enhancement

- [ ] Add file upload for assets
- [ ] Implement Two-Factor Authentication
- [ ] Add SMS notifications
- [ ] Create mobile apps (React Native)
- [ ] Add export/backup features

---

## 💡 Pro Tips

1. **For Development**
   - Use VS Code with REST Client extension
   - Test APIs directly from editor
   - Keep browser DevTools (F12) open

2. **For Testing**
   - Create test accounts for nominees
   - Test inactivity with modified timestamps
   - Test all asset visibility options
   - Test admin features with different roles

3. **For Performance**
   - Enable MongoDB caching
   - Use CDN for frontend assets
   - Implement pagination for large datasets
   - Cache API responses where appropriate

4. **For Security**
   - Always use HTTPS in production
   - Rotate JWT secrets regularly
   - Keep dependencies updated
   - Enable rate limiting on API
   - Regular security audits

---

## ✨ Key Highlights

### Backend

- **Authentication** - Secure JWT with refresh tokens
- **Encryption** - AES-256-GCM for assets at rest
- **Automation** - Daily cron job for inactivity checks
- **Notifications** - Professional email templates
- **Audit Trail** - Complete logging of all actions
- **Database** - MongoDB with proper indexing

### Frontend

- **Modern Stack** - React 18 with Vite
- **Responsive** - Works on all devices
- **State Management** - Context API for authentication
- **Error Handling** - Comprehensive error messages
- **Loading States** - Smooth loading indicators
- **Professional Design** - Clean, modern UI

---

## 📫 Support

If you encounter issues:

1. **Check Logs**
   - Backend: Console output
   - Frontend: Browser console (F12)
   - MongoDB: MongoDB logs

2. **Verify Environment**
   - Backend running on :5000?
   - Frontend running on :3000?
   - MongoDB accessible?
   - Firewall not blocking?

3. **Review Documentation**
   - `/server/SETUP.md`
   - `/server/API_DOCUMENTATION.md`
   - `/client/README.md`

4. **Test with curl**
   ```bash
   curl http://localhost:5000/api/v1/auth/register
   ```

---

## 🎉 You're All Set!

Your complete Digital Asset Inheritance System is now:

- ✅ Fully functional
- ✅ Production-ready
- ✅ Fully documented
- ✅ Easy to deploy

**Now go create something amazing! 🚀**

---

**Last Updated:** March 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
