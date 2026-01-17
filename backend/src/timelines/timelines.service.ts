import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { Timeline } from '@prisma/client';

@Injectable()
export class TimelinesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTimelineDto: CreateTimelineDto): Promise<Timeline> {
    return this.prisma.timeline.create({
      data: {
        ...createTimelineDto,
        dueDate: new Date(createTimelineDto.dueDate),
      },
      include: {
        wedding: true,
      },
    });
  }

  async findAll(weddingId?: string): Promise<Timeline[]> {
    return this.prisma.timeline.findMany({
      where: weddingId ? { weddingId } : undefined,
      include: {
        wedding: true,
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findOne(id: string): Promise<Timeline> {
    const timeline = await this.prisma.timeline.findUnique({
      where: { id },
      include: {
        wedding: true,
      },
    });

    if (!timeline) {
      throw new NotFoundException(`Timeline with ID ${id} not found`);
    }

    return timeline;
  }

  async update(id: string, updateTimelineDto: UpdateTimelineDto): Promise<Timeline> {
    try {
      return await this.prisma.timeline.update({
        where: { id },
        data: {
          ...updateTimelineDto,
          dueDate: new Date(updateTimelineDto.dueDate),
        },
        include: {
          wedding: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Timeline with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<Timeline> {
    try {
      return await this.prisma.timeline.delete({
        where: { id },
        include: {
          wedding: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Timeline with ID ${id} not found`);
    }
  }
}
