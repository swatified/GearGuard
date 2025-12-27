# GearGuard Frontend

Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_ENV=development
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to `http://localhost:3000`

## Project Structure

- `app/` - Next.js App Router pages and components
  - `components/` - Reusable React components
  - `lib/` - Utility libraries and API client
  - `hooks/` - Custom React hooks
  - `context/` - React Context providers
  - `services/` - API service functions
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions
- `public/` - Static assets

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features

- TypeScript for type safety
- Tailwind CSS for styling
- React Hook Form for form management
- Axios for API calls
- React Query for data fetching
- Responsive design
