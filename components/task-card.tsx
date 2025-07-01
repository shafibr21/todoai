"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { updateTask, deleteTask, type Task } from "@/lib/tasks"
import { Calendar, Edit, Trash2, Sparkles, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { format } from "date-fns"

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onUpdate: () => void
}

export function TaskCard({ task, onEdit, onUpdate }: TaskCardProps) {
  const [isGeneratingSubtasks, setIsGeneratingSubtasks] = useState(false)
  const [showSubtasks, setShowSubtasks] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (completed: boolean) => {
    setIsUpdating(true)
    try {
      await updateTask(task.id, {
        status: completed ? "completed" : "pending",
      })
      onUpdate()
    } catch (error) {
      console.error("Error updating task status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(task.id)
        onUpdate()
      } catch (error) {
        console.error("Error deleting task:", error)
      }
    }
  }

  const generateSubtasks = async () => {
    setIsGeneratingSubtasks(true)
    try {
      const response = await fetch("/api/suggest-subtasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate subtasks")
      }

      const { subtasks } = await response.json()

      await updateTask(task.id, { subtasks })
      onUpdate()
      setShowSubtasks(true)
    } catch (error) {
      console.error("Error generating subtasks:", error)
      alert("Failed to generate subtasks. Please try again.")
    } finally {
      setIsGeneratingSubtasks(false)
    }
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status === "pending"

  return (
    <Card
      className={`w-full transition-all duration-200 ${
        task.status === "completed" ? "opacity-75" : ""
      } ${isOverdue ? "border-red-200 bg-red-50" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={task.status === "completed"}
              onCheckedChange={handleStatusChange}
              disabled={isUpdating}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <CardTitle
                className={`text-lg leading-tight ${task.status === "completed" ? "line-through text-gray-500" : ""}`}
              >
                {task.title}
              </CardTitle>
              {task.description && <p className="text-sm text-gray-600 mt-1 leading-relaxed">{task.description}</p>}
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(task)} className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-3">
          <div className="flex items-center gap-2">
            <Badge variant={task.status === "completed" ? "secondary" : "default"}>{task.status}</Badge>
            {task.due_date && (
              <div className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-600" : "text-gray-500"}`}>
                <Calendar className="h-3 w-3" />
                {format(new Date(task.due_date), "MMM d, yyyy")}
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={generateSubtasks}
            disabled={isGeneratingSubtasks}
            className="text-xs bg-transparent"
          >
            {isGeneratingSubtasks ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 mr-1" />
                Suggest Subtasks
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      {task.subtasks && task.subtasks.length > 0 && (
        <CardContent className="pt-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSubtasks(!showSubtasks)}
            className="w-full justify-between p-2 h-auto text-sm"
          >
            <span>Subtasks ({task.subtasks.length})</span>
            {showSubtasks ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {showSubtasks && (
            <ul className="mt-2 space-y-1">
              {task.subtasks.map((subtask: string, index: number) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>{subtask}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      )}
    </Card>
  )
}
