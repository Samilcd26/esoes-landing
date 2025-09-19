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

Edit `.env.local` and add your SendGrid and Sanity credentials:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
SENDGRID_API_KEY=your_sendgrid_api_key
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-05-01
SANITY_API_TOKEN=your_sanity_api_token
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket_name
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
│   │   ├── client.ts     # Sanity client
│   │   └── services/     # API services
│   ├── hooks/            # Custom React Query hooks
│   └── types/            # TypeScript type definitions
└── ...
```

## API Layer

The project uses a layered architecture for API communication:

### 1. Sanity Client (`lib/api/client.ts`)
- Configured Sanity client
- Type-safe database operations

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

The application uses Sanity.io for content management. The schema definitions can be found in `lib/sanity/schemas`.

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key

# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket_name
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
