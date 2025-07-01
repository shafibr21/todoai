# Smart Task Manager with AI Assistance

A modern task management application built with Next.js 15, featuring AI-powered subtask suggestions using Google Gemini API and real-time data storage with Supabase.

## Features

- ✅ **Task Management**: Create, edit, delete, and mark tasks as complete
- 🤖 **AI-Powered Subtasks**: Generate actionable subtasks using Google Gemini AI
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔍 **Search & Filter**: Find tasks quickly with search and status filtering
- ⚡ **Real-time Updates**: Instant synchronization with Supabase backend
- 📅 **Due Dates**: Set and track task deadlines with overdue indicators
- 🎨 **Clean UI**: Modern interface built with Tailwind CSS and shadcn/ui

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL database)
- **AI Integration**: Google Gemini API
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account
- Google AI Studio account (for Gemini API)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd smart-task-manager
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Run the SQL script from \`scripts/create-tasks-table.sql\` in the Supabase SQL Editor

4. **Set up Google Gemini API**
   - Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

5. **Configure environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your environment variables:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key
   \`\`\`

6. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating Tasks
1. Click the "New Task" button
2. Fill in the task title, description (optional), and due date (optional)
3. Click "Create Task"

### AI Subtask Generation
1. Click the "Suggest Subtasks" button on any task
2. The AI will analyze your task and generate 3-5 actionable subtasks
3. Subtasks will be saved and displayed under the main task

### Managing Tasks
- **Complete**: Check the checkbox to mark tasks as completed
- **Edit**: Click the edit icon to modify task details
- **Delete**: Click the trash icon to remove tasks
- **Search**: Use the search bar to find specific tasks
- **Filter**: Filter tasks by status (All, Pending, Completed)

## Project Structure

\`\`\`
├── app/
│   ├── api/suggest-subtasks/    # Gemini AI integration endpoint
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── task-card.tsx            # Individual task display
│   ├── task-form.tsx            # Task creation/editing form
│   └── task-manager.tsx         # Main task management component
├── lib/
│   ├── supabase.ts              # Supabase client and types
│   ├── tasks.ts                 # Task CRUD operations
│   ��── utils.ts                 # Utility functions
└── scripts/
    └── create-tasks-table.sql   # Database schema
\`\`\`

## API Endpoints

### POST /api/suggest-subtasks
Generates AI-powered subtask suggestions for a given task.

**Request Body:**
\`\`\`json
{
  "title": "Task title",
  "description": "Optional task description"
}
\`\`\`

**Response:**
\`\`\`json
{
  "subtasks": ["Subtask 1", "Subtask 2", "Subtask 3"]
}
\`\`\`

## Database Schema

The application uses a single \`tasks\` table with the following structure:

\`\`\`sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  due_date TIMESTAMP WITH TIME ZONE,
  subtasks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

## Challenges Faced & Solutions

### 1. AI Response Parsing
**Challenge**: Google Gemini API responses weren't always in perfect JSON format.
**Solution**: Implemented robust parsing with multiple fallback strategies to extract subtasks from various response formats.

### 2. Real-time UI Updates
**Challenge**: Keeping the UI synchronized after task operations.
**Solution**: Implemented proper state management with loading states and optimistic updates.

### 3. Mobile Responsiveness
**Challenge**: Ensuring the interface works well on all screen sizes.
**Solution**: Used Tailwind CSS responsive utilities and tested across different viewport sizes.

### 4. Error Handling
**Challenge**: Gracefully handling API failures and network issues.
**Solution**: Added comprehensive error handling with user-friendly error messages and retry mechanisms.

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js applications (Netlify, Railway, etc.).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
\`\`\`
