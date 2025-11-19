# Akions - Full Stack React Native App

A comprehensive platform connecting businesses with top talent for internships, product development, and custom solutions. Built with React Native (Expo) for both web and mobile platforms.

## Features

- ✅ **Authentication System**: Complete login/signup with form validation
- ✅ **Home Page**: Hero section with three core verticals
- ✅ **Marketplace**: Browse ready-made software products with filters
- ✅ **Internships**: Explore internship opportunities with search and filters
- ✅ **About Page**: Company story, mission, team, and values
- ✅ **Blog**: Read articles with categories and individual post views
- ✅ **Custom Projects**: Learn about custom development services
- ✅ **Responsive Design**: Works on web, iOS, and Android
- ✅ **Mock Backend**: Local authentication and data storage

## Tech Stack

- **Frontend**: React Native with Expo
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **TypeScript**: Full type safety

## Project Structure

```
akions-app/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Navbar.tsx
│   ├── screens/          # All application screens
│   │   ├── LoginScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── MarketplaceScreen.tsx
│   │   ├── InternshipsScreen.tsx
│   │   ├── AboutScreen.tsx
│   │   ├── BlogScreen.tsx
│   │   ├── BlogPostScreen.tsx
│   │   └── CustomProjectsScreen.tsx
│   ├── navigation/       # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── context/          # React Context for state management
│   │   └── AuthContext.tsx
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   └── data/             # Mock data
│       └── mockData.ts
├── App.tsx               # Main app entry point
├── tailwind.config.js    # Tailwind configuration
├── babel.config.js       # Babel configuration
└── package.json
```

## Installation

1. **Install dependencies:**
   ```bash
   cd akions-app
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on different platforms:**
   - **Web**: Press `w` in the terminal or run `npm run web`
   - **Android**: Press `a` or run `npm run android` (requires Android Studio)
   - **iOS**: Press `i` or run `npm run ios` (requires macOS and Xcode)

## Usage

### Authentication
- The app uses a mock authentication system
- Any email/password combination will work for login
- User data is stored locally using AsyncStorage
- Logout is available from the navbar

### Navigation
All main pages are accessible from the navbar:
- **Home**: Landing page with hero and verticals
- **Marketplace**: Browse software products
- **Internships**: Find internship opportunities
- **Projects**: Learn about custom projects
- **Blog**: Read articles and posts
- **About**: Company information

### Features in Action

1. **Login/Signup**: Complete form validation with error messages
2. **Search & Filters**: All listing pages have functional search and filter dropdowns
3. **Navigation**: Click any link or button to navigate between pages
4. **Blog Comments**: Post comments on blog articles
5. **Responsive**: All pages adapt to different screen sizes

## Mock Data

The app includes mock data for:
- 6 Software products
- 4 Internship listings
- 5 Blog posts with comments
- 4 Team members
- 4 Company values

You can modify the mock data in `src/data/mockData.ts`

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  primary: '#0ea5e9',    // Main brand color
  secondary: '#1e293b',  // Secondary color
  dark: '#0f172a',       // Dark backgrounds
  light: '#f8fafc',      // Light backgrounds
}
```

### Content
- Update mock data in `src/data/mockData.ts`
- Modify screen components in `src/screens/`
- Add new pages by creating screen components and updating navigation

## Development Notes

- All buttons and navigation are fully functional
- Form validation is implemented on login/signup
- Authentication state persists across app restarts
- Navigation automatically switches between auth and main stacks

## Future Enhancements

- Connect to a real backend API
- Add image uploads for products and profiles
- Implement real-time chat for custom projects
- Add payment integration for marketplace
- Enhanced filtering and sorting options
- User profile management
- Social media integration

## Troubleshooting

If you encounter issues:

1. **Clear Metro bundler cache:**
   ```bash
   npm start -- --clear
   ```

2. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Check Expo version:**
   ```bash
   npx expo --version
   ```

## License

© 2024 Akions. All rights reserved.
