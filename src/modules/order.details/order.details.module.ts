import { Module } from '@nestjs/common';
import { OrderDetailService } from './order.details.service';
import { OrderDetailController } from './order.details.controller';

@Module({
  controllers: [OrderDetailController],
  providers: [OrderDetailService],
})

export class OrderDetailModule {}
