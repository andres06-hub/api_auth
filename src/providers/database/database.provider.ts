import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from 'src/models/user.entity';
import { Logger } from '@nestjs/common';

config({ path: 'db.env' });

const logger = new Logger();

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_NAME,
        entities: [User],
        synchronize: true,
      });
      const x = await dataSource.initialize();
      logger.log('Connection DB');
      return x;
    },
  },
];
