import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './infrastructure/config/database.config';
import { HttpModule } from './adapters/http/http.module';

/**
 * Root application module
 */
@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    HttpModule,
  ],
})
export class AppModule {}

