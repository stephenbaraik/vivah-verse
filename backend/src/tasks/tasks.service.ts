import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
      },
      include: {
        wedding: true,
        assignee: true,
      },
    });
  }

  async findAll(weddingId?: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: weddingId ? { weddingId } : undefined,
      include: {
        wedding: true,
        assignee: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        wedding: true,
        assignee: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      return await this.prisma.task.update({
        where: { id },
        data: {
          ...updateTaskDto,
          dueDate: updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : undefined,
        },
        include: {
          wedding: true,
          assignee: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<Task> {
    try {
      return await this.prisma.task.delete({
        where: { id },
        include: {
          wedding: true,
          assignee: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    try {
      return await this.prisma.task.update({
        where: { id },
        data: { status },
        include: {
          wedding: true,
          assignee: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
