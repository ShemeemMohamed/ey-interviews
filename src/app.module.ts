import { Module } from '@nestjs/common';
import { OrderController } from './orders/orders.controller';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [],
})
export class AppModule {}
