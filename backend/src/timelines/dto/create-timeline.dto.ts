import { IsString, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTimelineDto {
  @ApiProperty({ description: 'Wedding ID this timeline belongs to' })
  @IsUUID()
  weddingId: string;

  @ApiProperty({ description: 'Milestone description' })
  @IsString()
  milestone: string;

  @ApiProperty({ description: 'Due date for the milestone' })
  @IsDateString()
  dueDate: string;
}

export class UpdateTimelineDto {
  @ApiProperty({ description: 'Milestone description' })
  @IsString()
  milestone: string;

  @ApiProperty({ description: 'Due date for the milestone' })
  @IsDateString()
  dueDate: string;
}