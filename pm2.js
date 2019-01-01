module.exports = {
    apps: [
        {
            name: "meatify",
            script: "./bin/www",
            watch: true,
            env: {
                "PORT": 3000,
                "NODE_ENV": "development"
            },
            env_production:{
                "PORT": 3000,
                "NODE_ENV": "production"
            }
        }
    ]
}