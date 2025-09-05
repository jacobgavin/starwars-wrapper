process.env.TZ = "UTC";

// set port to thread id
process.env.PORT = "3000" + process.env.VITEST_POOL_ID;
