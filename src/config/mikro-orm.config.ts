import { defineConfig } from '@mikro-orm/mysql';
import { User } from 'src/modules/user/entities/user.entity';

const mikroOrmConfig = defineConfig({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rMfeooxf12',
  dbName: process.env.DB_NAME || 'ftn_db_main',
  entities: [User],
  
  // Disable auto-discovery of entities to avoid loading unexpected tables
  discovery: {
    warnWhenNoEntities: false,
    requireEntitiesArray: true,
    alwaysAnalyseProperties: false,
    disableDynamicFileAccess: true,
  },
  
  // Turn off all schema validation and generation
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: false,
    ignoreSchema: [],
  },
  
  migrations: { },
  
  // Performance and behavior settings to prevent any schema changes
  allowGlobalContext: true,
  autoJoinOneToOneOwner: false,
  findOneOrFailHandler: () => {
    throw new Error('Entity not found');
  },
  strict: false,
  validate: false,
  
  // MySQL specific options
  driverOptions: {
    connection: {
      charset: 'utf8mb4',
      timezone: 'Z',
      flags: ['-FOUND_ROWS', '-IGNORE_SPACE'],
      supportBigNumbers: true,
      dateStrings: true,
    },
  },
});

export default mikroOrmConfig;