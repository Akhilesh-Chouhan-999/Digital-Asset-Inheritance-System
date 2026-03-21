# DAIS Frontend - React Application

A modern, interactive React frontend for the Digital Asset Inheritance System (DAIS).

## 🚀 Features

- **Authentication** - Secure login and registration
- **Asset Management** - Create, view, edit, and delete digital assets
- **Nominee Management** - Add and manage beneficiaries
- **Activity Monitoring** - Track account inactivity and inheritance triggers
- **Admin Dashboard** - System statistics and user management (admin only)
- **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- **Real-time Updates** - Live data synchronization with backend
- **Professional UI** - Modern, clean, and intuitive interface

## 📋 Prerequisites

- Node.js 16+ and npm
- Running DAIS backend server (http://localhost:5000)
- Modern web browser

## ⚙️ Installation

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` file (optional - defaults work for local development):

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_FRONTEND_URL=http://localhost:3000
```

### 3. Start Development Server

```bash
npm run dev
```

The application will automatically open at `http://localhost:3000`

## 📦 Available Scripts

### Development

```bash
npm run dev
```

Starts the Vite development server with hot module replacement.

### Production Build

```bash
npm run build
```

Creates an optimized production build in the `dist` directory.

### Preview Build

```bash
npm run preview
```

Previews the production build locally.

### Lint Code

```bash
npm run lint
```

Runs ESLint on all JavaScript and JSX files.

## 📁 Project Structure

```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx       # Top navigation bar
│   │   ├── Sidebar.jsx      # Side navigation menu
│   │   ├── Common.jsx       # Alert, Modal, Loading, etc.
│   │   ├── ProtectedRoute.jsx # Route protection
│   │   └── *.css            # Component styles
│   ├── contexts/            # React Context for state
│   │   └── AuthContext.jsx  # Authentication state
│   ├── pages/               # Page components
│   │   ├── LoginPage.jsx    # Login page
│   │   ├── RegisterPage.jsx # Sign up page
│   │   ├── DashboardPage.jsx # Home dashboard
│   │   ├── AssetsPage.jsx   # Digital assets management
│   │   ├── NomineesPage.jsx # Beneficiaries management
│   │   ├── InactivityPage.jsx # Activity status
│   │   ├── AdminPage.jsx    # Admin dashboard
│   │   └── *.css            # Page styles
│   ├── services/            # API integration
│   │   └── api.js           # Axios configuration & API calls
│   ├── App.jsx              # Main app component with routing
│   ├── App.css              # App layout styles
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies
├── .env.example             # Environment template
└── README.md                # This file
```

## 🎨 Design & Styling

### CSS Approach

- **CSS Variables** - Defined in `index.css` for consistent theming
- **Utility Classes** - Bootstrap-like utility classes for quick styling
- **Component Styles** - Each component has its own CSS file for isolation
- **Responsive Design** - Mobile-first approach with media queries

### Color Scheme

- **Primary** - Blue (#2563eb) - Main actions and highlights
- **Secondary** - Purple (#7c3aed) - Secondary actions
- **Success** - Green (#10b981) - Positive actions/status
- **Danger** - Red (#ef4444) - Destructive actions/errors
- **Warning** - Amber (#f59e0b) - Warnings
- **Info** - Cyan (#0ea5e9) - Information

## 🔌 API Integration

### Authentication

```javascript
// Login
const response = await authService.login(email, password);
const { token, user } = response.data.data;

// Register
await authService.register(name, email, password);

// Logout
await authService.logout();
```

### Assets

```javascript
// Get assets
const assets = await assetService.getAssets();

// Create asset
await assetService.createAsset({
  title,
  type,
  assetContent,
  visibility,
  description,
});

// Update asset
await assetService.updateAsset(id, data);

// Delete asset
await assetService.deleteAsset(id);

// Share asset with nominee
await assetService.shareAsset(assetId, nomineeId);
```

### Nominees

```javascript
// Get all nominees
const nominees = await nomineeService.getNominees();

// Add nominee
await nomineeService.addNominee({
  name,
  email,
  relationship,
});

// Update nominee
await nomineeService.updateNominee(id, data);

// Delete nominee
await nomineeService.deleteNominee(id);

// Verify nominee
await nomineeService.verifyNominee(id, token);
```

### Inactivity

```javascript
// Get inactivity status
const status = await inactivityService.getStatus();

// Mark as active
await inactivityService.markActive();

// Get history
const history = await inactivityService.getHistory();

// Trigger inheritance
await inactivityService.triggerInheritance();
```

### Admin

```javascript
// Get system statistics
const stats = await adminService.getStats();

// Get users
const users = await adminService.getUserManagement({ limit: 20 });

// Get audit logs
const logs = await adminService.getAuditLogs({ limit: 50 });

// Update configuration
await adminService.updateConfig(config);
```

## 🔐 Authentication Flow

1. **User registers** - Name, email, password
2. **Email verification sent** - Link sent to email
3. **User verifies email** - Clicks link to confirm
4. **User logs in** - Email and password
5. **Tokens issued** - Access token (1h) and Refresh token (7d)
6. **Automatic refresh** - Tokens refreshed before expiry
7. **Protected routes** - Redirect to login if no token

## 📱 Responsive Breakpoints

- **Desktop** - 1024px and above
- **Tablet** - 768px to 1023px
- **Mobile** - Below 768px

All components adapt gracefully across breakpoints.

## 🧪 Testing

To test the frontend with the backend:

1. **Start backend server**

   ```bash
   cd server
   npm run dev
   ```

2. **Start frontend**

   ```bash
   cd client
   npm run dev
   ```

3. **Open browser** - Navigate to http://localhost:3000

4. **Test accounts**
   - Register new account
   - Or use existing account from backend

## 🚀 Deployment

### Production Build

```bash
npm run build
```

This creates a `dist` folder optimized for production.

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
cd client
vercel
```

### Deploy to Other Platforms

1. **GitHub Pages**

   ```bash
   npm install --save-dev gh-pages
   # Update vite.config.js with base path
   npm run build
   npm run deploy
   ```

2. **Netlify**
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **AWS S3 + CloudFront**
   ```bash
   npm run build
   # Upload dist folder to S3
   ```

## 🐛 Troubleshooting

### Frontend not connecting to backend

- Ensure backend is running on port 5000
- Check VITE_API_URL in .env file
- Check browser console for CORS errors

### Login not working

- Verify backend is running
- Check email and password are correct
- Check browser console for error messages

### Styles not loading

- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server
- Check CSS files are in correct directories

### Components not rendering

- Check browser console for errors
- Verify all imports are correct
- Ensure all dependencies are installed

## 📚 Documentation

- **Backend Docs** - See `../server/API_DOCUMENTATION.md`
- **Setup Guide** - See `../server/SETUP.md`
- **Architecture** - See `../README.md`

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 License

This project is part of the Digital Asset Inheritance System (DAIS).

## 📞 Support

For issues or questions:

1. Check the troubleshooting section
2. Review the backend documentation
3. Check browser console for error messages
4. Verify network requests in browser DevTools

---

**Happy coding! 🚀**
