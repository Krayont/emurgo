import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

//
@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
			envFilePath: '.env', // Load the .env file
			isGlobal: true,
		})
	]
})

//
export class AppConfigModule {}