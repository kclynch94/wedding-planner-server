module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DATABASE_URL || 'postgresql://localhost/wedding_planner',
    TES_DB_URL: process.env.TEST_DB_URL || 'postgresql://localhost/wedding_planner_test',
    JWT_SECRET: process.env.JWT_SECRET || 'test'
}