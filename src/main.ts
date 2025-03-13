import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') ?? 3001;

  app.setGlobalPrefix('api/v1', { exclude: [''] });

  // Pipe là một công cụ dùng để xử lý dữ liệu trước khi dữ liệu được truyền vào controller.
  // Pipe có thể làm các công việc như:
  // Kiểm tra dữ liệu đầu vào (Validation)
  // Chuyển đổi dữ liệu (Transform)
  // Loại bỏ các dữ liệu không hợp lệ (Filtering)
  // Trường hợp này ValidationPipe tự validate giùm các trường trong dto
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // loại bỏ các field không được định nghĩa trong DTO
    forbidNonWhitelisted: true, // Báo lỗi nếu có field lạ
    transform: true, // Tự động convert kiểu dữ liệu
  }));

  await app.listen(port);
}
bootstrap();
