import { TaskData } from "../dataLayer/taskData";
import { TaskEntry } from "../models/TaskEntry";
import { CreateTaskFunction } from "../models/CreateTaskFunction";
import * as uuid from 'uuid'
import { UpdateTaskEntry } from "../models/UpdateTaskEntry";


const taskData = new TaskData();


export async function getTasks(userId: string): Promise<TaskEntry[]> {
    return taskData.getTasks(userId);
}

export async function getPublictasks(state: string): Promise<TaskEntry[]> {
  return taskData.getPublictasks(state);
}

export async function createTask(
    createTaskFunction: CreateTaskFunction, 
    userId: string
    ): Promise<TaskEntry>{
    
    const itemId = uuid.v4()

    return await taskData.createTask({
      taskId: itemId,
      userId: userId,
      createdAt: new Date().getTime().toString(),
      column: "backlog",
      name: createTaskFunction.name,
      description: createTaskFunction.description,
      state: createTaskFunction.state
    });
  }

export async function deleteTask(taskId: string, userId: string) {
  return await taskData.deleteTask(taskId, userId);
}

export async function updateTask(
  taskId: string,
  userId: string, 
  UpdateTaskEntry: UpdateTaskEntry): Promise<TaskEntry> {

    return await taskData.updateTask(
      taskId,
      userId,
      {
        name: UpdateTaskEntry.name,
        description: UpdateTaskEntry.description,
        state: UpdateTaskEntry.state,
        column: UpdateTaskEntry.column
      })
  
}

export async function getTask(taskId: string) {
  return await taskData.getTask(taskId);
}