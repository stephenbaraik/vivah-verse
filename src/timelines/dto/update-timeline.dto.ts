import { IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTimelineDto {
  @ApiProperty({ description: 'Milestone description' })
  @IsString()
  milestone: string;

  @ApiProperty({ description: 'Due date for the milestone' })
  @IsDateString()
  dueDate: string;
}