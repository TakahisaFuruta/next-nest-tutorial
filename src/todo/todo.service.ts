import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-todo.dto';
import { Task } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async createTodo(userId: number, dto: CreateTaskDto): Promise<Task> {
    const task = this.prisma.task.create({
      data: {
        userId: userId,
        ...dto,
      },
    });
    return task;
  }
}
