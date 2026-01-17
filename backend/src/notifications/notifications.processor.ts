import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { NotificationsService } from './notifications.service';

type EmailJob = {
  to: string;
  subject: string;
  html: string;
};

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  constructor(private readonly notifications: NotificationsService) {
    super();
  }

  async process(job: Job): Promise<void> {
    if (job.name === 'email') {
      const payload = job.data as EmailJob;
      await this.notifications.sendEmailNow(
        payload.to,
        payload.subject,
        payload.html,
      );
      return;
    }

    // Unknown job type: ignore (keeps processor forward-compatible)
  }
}
