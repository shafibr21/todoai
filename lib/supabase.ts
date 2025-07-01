import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Task = {
  id: string
  title: string
  description: string | null
  status: "pending" | "completed"
  due_date: string | null
  subtasks: string[]
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: Task
        Insert: Omit<Task, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Task, "id" | "created_at" | "updated_at">>
      }
    }
  }
}
