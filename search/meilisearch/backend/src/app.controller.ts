import { Controller, Get, Logger, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) { }

  @Get()
  async getHello(@Query('query') search: string) {
    const timeBefore = new Date().getTime();
    await this.appService.addDocuments();
    const results = await this.appService.searchFor(search || '');
    this.logger.log(`Took ${new Date().getTime() - timeBefore} ms`);

    return results;
  }
}
