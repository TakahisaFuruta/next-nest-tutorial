import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TodoService } from './todo.service';
import { Request } from 'express';
import { CreateTaskDto } from './dto/create-todo.dto';
import { Task } from '@prisma/client';
import { UpdateTaskDto } from './dto/update-todo.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getTasks(@Req() req: Request): Promise<Task[]> {
    return this.todoService.getTodoList(req.user.id);
  }

  @Get(':id')
  getTask(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
  ): Promise<Task> {
    return this.todoService.getTodo(req.user.id, taskId);
  }

  @Post()
  create(@Req() req: Request, @Body() dto: CreateTaskDto): Promise<Task> {
    return this.todoService.createTodo(req.user.id, dto);
  }

  @Patch(':id')
  updateTask(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.todoService.updateTodo(req.user.id, taskId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteTask(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
  ): Promise<void> {
    return this.todoService.deleteTask(req.user.id, taskId);
  }
}
