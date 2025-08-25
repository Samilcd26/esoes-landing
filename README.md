# ESOES Landing Page

Modern event management platform built with Next.js, SendGrid, and React Query.

## Features

- 🎯 Modern UI with Framer Motion animations
- 📧 SendGrid email service
- 📊 React Query for efficient data fetching
- 🎨 Tailwind CSS for styling
- 📱 Responsive design
- ⚡ TypeScript for type safety

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Email Service**: SendGrid
- **State Management**: React Query (TanStack Query)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React, Tabler Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd esoes-landing
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
esoes-landing/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   └── ...                # Other pages
├── components/            # React components
│   ├── providers/         # Context providers
│   ├── ui/               # UI components
│   └── examples/         # Example components
├── lib/                  # Utility libraries
│   ├── api/              # API layer
│   │   ├── client.ts     # Supabase client
│   │   └── services/     # API services
│   ├── hooks/            # Custom React Query hooks
│   └── types/            # TypeScript type definitions
└── ...
```

## API Layer

The project uses a layered architecture for API communication:

### 1. Supabase Client (`lib/api/client.ts`)
- Configured Supabase client with authentication
- Type-safe database operations
- Automatic token management

### 2. API Services (`lib/api/services/`)
- **eventService.ts**: Event CRUD operations
- **authService.ts**: Authentication operations
- Business logic separation

### 3. React Query Hooks (`lib/hooks/`)
- **useEvents.ts**: Event-related queries and mutations
- **useAuth.ts**: Authentication queries and mutations
- Automatic caching and state management

## Usage Examples

### Using Event Hooks

```tsx
import { useEvents, useRegisterForEvent } from '@/hooks/useEvents';

function EventList() {
  const { data: events, isLoading } = useEvents({ page: 1, limit: 10 });
  const registerMutation = useRegisterForEvent();

  const handleRegister = async (eventId: string) => {
    try {
      await registerMutation.mutateAsync(eventId);
      // Success handling
    } catch (error) {
      // Error handling
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {events?.data.map(event => (
        <EventCard key={event.id} event={event} onRegister={handleRegister} />
      ))}
    </div>
  );
}
```

### Using Auth Hooks

```tsx
import { useCurrentUser, useLogin } from '@/hooks/useAuth';

function LoginForm() {
  const { data: user } = useCurrentUser();
  const loginMutation = useLogin();

  const handleLogin = async (credentials) => {
    try {
      await loginMutation.mutateAsync(credentials);
      // Redirect or show success message
    } catch (error) {
      // Handle error
    }
  };

  if (user) return <div>Welcome, {user.first_name}!</div>;

  return <LoginForm onSubmit={handleLogin} />;
}
```

## Database Schema

The application expects the following Supabase tables:

### Users Table
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'organizer')),
  avatar_url TEXT,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Departments Table
```sql
CREATE TABLE departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Events Table
```sql
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  capacity INTEGER NOT NULL DEFAULT 0,
  registered_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Event Registrations Table
```sql
CREATE TABLE event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);
```

### FAQs Table
```sql
CREATE TABLE faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Contact Messages Table
```sql
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Uploaded Files Table
```sql
CREATE TABLE uploaded_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video')),
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  r2_bucket TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  cdn_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Database Functions

The application uses several PostgreSQL functions for complex operations:

### Department Management
- `get_department_statistics()` - Returns department statistics with member counts
- `get_department_members(dept_id)` - Returns all members of a specific department
- `assign_user_to_department(user_id, dept_id)` - Assigns a user to a department
- `remove_user_from_department(user_id)` - Removes a user from their department

### Event Management
- `increment_event_registration_count(event_id)` - Increments event registration count
- `decrement_event_registration_count(event_id)` - Decrements event registration count
- `get_event_statistics()` - Returns event statistics

## Environment Variables

Create a `.env.local` file with the following variables:

```env

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Sanity Configuration (if still using)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token

# AWS S3 Configuration (if using)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket_name

# Note: Supabase email functionality has been replaced with SendGrid
# Remove these variables if no longer using Supabase:
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
