module.exports = {
  name: 'default',
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, //process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV !== 'production',
  entities: [
    process.env.NODE_ENV !== 'development' ? 'dist/entity/*.js' : 'src/entity/*.ts'
  ],
  migrations: [
    process.env.NODE_ENV !== 'development' ? 'dist/migration/**/*.js' : 'src/migration/**/*.ts'
  ],
  subscribers: [
    process.env.NODE_ENV !== 'development' ? 'dist/subscribers/*.js' : 'src/subscribers/*.ts'
  ],
}
