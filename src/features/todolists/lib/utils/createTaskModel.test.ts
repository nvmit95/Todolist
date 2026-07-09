import { describe, it, expect } from "vitest"
import { TaskPriority, TaskStatus } from "@/common/enums"
import type { DomainTask } from "@/features/todolists/api/tasksApi.types"
import { createTaskModel } from "./createTaskModel"

const mockTask: DomainTask = {
  id: "task-1",
  todoListId: "list-1",
  title: "Buy groceries",
  description: null,
  status: TaskStatus.New,
  priority: TaskPriority.Middle,
  startDate: null,
  deadline: null,
  order: 1,
  addedDate: "2024-01-01T00:00:00",
}

describe("createTaskModel", () => {
  it("copies all fields from the source task", () => {
    const model = createTaskModel(mockTask, {})

    expect(model).toEqual({
      title: "Buy groceries",
      description: null,
      status: TaskStatus.New,
      priority: TaskPriority.Middle,
      startDate: null,
      deadline: null,
      order: 1,
    })
  })

  it("overrides only the fields passed in domainModel", () => {
    const model = createTaskModel(mockTask, {
      title: "Buy milk",
      status: TaskStatus.Completed,
    })

    expect(model.title).toBe("Buy milk")
    expect(model.status).toBe(TaskStatus.Completed)
    expect(model.priority).toBe(TaskPriority.Middle)
    expect(model.order).toBe(1)
  })

  it("supports order override for drag-and-drop reordering", () => {
    const model = createTaskModel(mockTask, { order: 5 })

    expect(model.order).toBe(5)
    expect(model.title).toBe("Buy groceries")
  })
})
