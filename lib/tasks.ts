import { supabase, type Task } from "./supabase"

export { type Task }

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createTask(task: Omit<Task, "id" | "created_at" | "updated_at">): Promise<Task> {
  const { data, error } = await supabase.from("tasks").insert(task).select().single()

  if (error) throw error
  return data
}

export async function updateTask(
  id: string,
  updates: Partial<Omit<Task, "id" | "created_at" | "updated_at">>,
): Promise<Task> {
  const { data, error } = await supabase.from("tasks").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", id)
  if (error) throw error
}
