import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from './multer-options.multer';
import {
  Bill,
  Client,
  Inventory,
  Manager,
  MenuItem,
  MetaData,
  Order,
  OrderItem,
  Reservation,
  Restaurant,
  Review,
  User,
  Table as RestaurantTable,
  Waiter,
} from './entities';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ManagerModule } from './manager/manager.module';
import { OTP } from './entities/otp.entity';
import { EmailModule } from './email/email.module';
import { MenuModule } from './menu/menu.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { OrderModule } from './order/order.module';
import { PrepStation } from './entities/prepStaion.entity';
import { PrepStationModule } from './prep-station/prep-station.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, MulterModule.register(multerOptions)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          Bill,
          Client,
          Inventory,
          Manager,
          MenuItem,
          MetaData,
          Order,
          OrderItem,
          Reservation,
          Restaurant,
          Review,
          RestaurantTable,
          User,
          Waiter,
          OTP,
          PrepStation,
        ],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([
      Bill,
      Client,
      Inventory,
      Manager,
      MenuItem,
      MetaData,
      Order,
      OrderItem,
      Reservation,
      Restaurant,
      Review,
      RestaurantTable,
      User,
      Waiter,
      OTP,
      PrepStation,
    ]),
    AdminModule,
    AuthModule,
    ManagerModule,
    EmailModule,
    MenuModule,
    RestaurantModule,
    OrderModule,
    PrepStationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
