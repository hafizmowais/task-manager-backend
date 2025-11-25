import { Module } from '@nestjs/common';
import { ApplicationModule } from '../../application/application.module';
import { TaskController } from './controllers/task.controller';
import { UserController } from './controllers/user.controller';

/**
 * HTTP module - provides REST API controllers
 */
@Module({
  imports: [ApplicationModule],
  controllers: [TaskController, UserController],
})
export class HttpModule {}

