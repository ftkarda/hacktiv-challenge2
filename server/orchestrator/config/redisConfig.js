const Redis = require("ioredis")
const redis = new Redis({
    port: "13082", // Redis port
    host: "redis-13082.c295.ap-southeast-1-1.ec2.cloud.redislabs.com", // Redis host
    password: "0Ox1jBmceh3RrGFbctXo0tmba9bjbmvn",
})

module.exports = redis