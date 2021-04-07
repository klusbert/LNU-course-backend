module.exports = {
    apps : [
        {
            name: "lnu-api",
            script: "./src/server.js",
            watch: true,
            env: {
                "PORT": 3000,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 5551,
                "CONNECTION_STRING": "mongodb://localhost:27017/",
                "MONGO_DATABASE_NAME": "courses",
                "SESSION_NAME": "session",
                "SESSION_SECRET": "test",
                "NODE_ENV": "production",
                "TOKEN_SECRET": "My special secret",
            }
        }
    ]
}
