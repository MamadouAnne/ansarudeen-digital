# Project Structure

Ansarudeen Digital - React Native/Expo App

## Directory Structure

```
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   ├── admin/             # Admin screens
│   ├── auth/              # Authentication screens
│   ├── events/            # Events screens
│   ├── news/              # News screens
│   └── projects/          # Projects screens
│
├── assets/                # Static assets
│   └── images/           # Image files
│
├── components/            # Reusable React components
│   └── ui/               # UI components
│
├── config/                # Configuration files
│   ├── babel.config.js   # Babel configuration
│   ├── metro.config.js   # Metro bundler config
│   ├── tailwind.config.js # TailwindCSS config
│   └── tsconfig.json     # TypeScript config
│
├── constants/             # App constants
│
├── contexts/              # React Context providers
│
├── database/              # Database files
│   ├── scripts/          # Database setup scripts
│   ├── migrations/       # (empty - see supabase/migrations)
│   └── archive/          # Archived files
│
├── hooks/                 # Custom React hooks
│
├── lib/                   # Utility libraries
│
├── services/              # API and service functions
│
├── supabase/              # Supabase configuration
│   └── migrations/       # Active database migrations
│
└── types/                 # TypeScript type definitions
```

## Root Files

### Configuration
- `.eslintrc.js` - ESLint configuration
- `app.json` - Expo app configuration
- `package.json` - NPM package configuration
- `babel.config.js` → `config/babel.config.js` (symlink)
- `metro.config.js` → `config/metro.config.js` (symlink)
- `tailwind.config.js` → `config/tailwind.config.js` (symlink)
- `tsconfig.json` → `config/tsconfig.json` (symlink)

### Environment
- `.env` - Environment variables (gitignored)
- `.env.example` - Environment template

### Utilities
- `reset-project.js` - Project reset script
- `global.css` - Global styles

## Key Features

### 🎨 Styling
- **NativeWind** (TailwindCSS for React Native)
- **StyleSheet API** for performance-critical components
- Custom theme configuration in `tailwind.config.js`

### 🗄️ Database
- **Supabase** for backend
- Migrations in `supabase/migrations/`
- Setup scripts in `database/scripts/`

### 📱 Navigation
- **Expo Router** (file-based routing)
- Tab navigation in `app/(tabs)/`
- Stack navigation for nested screens

### 🔐 Authentication
- Supabase Auth
- Protected routes
- User profiles

## Development

### Start Development Server
```bash
npm start              # Normal start
npm run start:clean    # Start with cache cleared
```

### Platform-Specific
```bash
npm run android        # Android
npm run ios            # iOS
npm run web            # Web
```

### Maintenance
```bash
npm run lint           # Run ESLint
npm run reset-project  # Reset project to template
```

## Database Management

### Migrations
Located in: `supabase/migrations/`

Create new migration:
```bash
supabase migration new migration_name
```

### Setup Scripts
Located in: `database/scripts/`
- `setup-database.sql` - Main setup
- `fix-existing-user.sql` - User fixes
- `supabase-setup-simple.sql` - Simple setup

## Performance Optimizations

1. **Memoized Components** - Using `React.memo()` for headers and cards
2. **Code Splitting** - Lazy loading with Expo Router
3. **Image Optimization** - WebP format for images
4. **Cache Management** - Clean start script for development

## Notes

- Config files are symlinked to root for tooling compatibility
- All SQL migrations are tracked in git
- Database scripts are for reference and manual fixes
- .DS_Store files are automatically ignored
