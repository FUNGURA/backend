import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './handlers/global-exception.handler';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('FUNGURA System');
  setInterval(() => {
    if (global.gc) {
      console.log(global.gc);
      global.gc();
    }
  }, 60);

  const corsOptions: CorsOptions = {
    origin: '*', // Adjust this to allow only specific origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  app.enableCors(corsOptions);
  dotenv.config();

  const gp: string = 'api/v1';
  app.setGlobalPrefix(gp);

  app.useGlobalFilters(new HttpExceptionFilter());
  const options = new DocumentBuilder()
    .setTitle('Fungura Apis')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();
  const document = SwaggerModule.createDocument(app, options);

  // sort
  document.tags = (document.tags || []).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  // Sort paths alphabetically
  document.paths = Object.keys(document.paths)
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc, key) => {
      acc[key] = document.paths[key];
      return acc;
    }, {});

  SwaggerModule.setup('api/v1/swagger-ui.html', app, document);
  const port = process.env.PORT;
  await app.listen(port);
  logger.log(`Server listening port ${port}...`);
}
void bootstrap();
