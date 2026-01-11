import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { SearchService } from './search.service';

@Processor('search')
export class SearchProcessor extends WorkerHost {
  constructor(private readonly search: SearchService) {
    super();
  }

  async process(job: Job): Promise<void> {
    if (job.name === 'reindex-venues') {
      await this.search.reindexVenues();
      return;
    }
  }
}
