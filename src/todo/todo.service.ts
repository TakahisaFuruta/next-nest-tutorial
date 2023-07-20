import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-todo.dto';
import { Task } from '@prisma/client';
import { UpdateTaskDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async getTodoList(userId: number): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId: userId,
      },
    });
    return tasks;
  }

  async getTodo(userId: number, taskId: number): Promise<Task> {
    const task = await this.prisma.task.findFirst({
      where: {
        userId: userId,
        id: taskId,
      },
    });
    return task;
  }

  async createTodo(userId: number, dto: CreateTaskDto): Promise<Task> {
    const task = await this.prisma.task.create({
      data: {
        userId: userId,
        ...dto,
      },
    });
    return task;
  }

  async updateTodo(
    userId: number,
    taskId: number,
    dto: UpdateTaskDto,
  ): Promise<Task> {
    return await this.prisma.task.update({
      where: {
        userId: userId,
        id: taskId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteTask(userId: number, taskId: number): Promise<void> {
    await this.prisma.task.delete({
      where: {
        userId: userId,
        id: taskId,
      },
    });
  }
}
