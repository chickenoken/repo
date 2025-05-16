import { defineConfig, UnderscoreNamingStrategy } from '@mikro-orm/mysql';
import { join } from 'path';

const mikroOrmConfig = defineConfig({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rMfeooxf12',
  dbName: process.env.DB_NAME || 'ftn_db_main',

  entities: [join(__dirname, '../modules/entities/*.js')], 
  entitiesTs: [join(__dirname, '../modules/entities/*.ts')], 

  discovery: {
    warnWhenNoEntities: false,
    requireEntitiesArray: false,
    alwaysAnalyseProperties: true,
    disableDynamicFileAccess: false,
  },

  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: false,
    ignoreSchema: [],
  },
});

export default mikroOrmConfig;