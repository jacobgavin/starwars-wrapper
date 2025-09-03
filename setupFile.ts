process.env.TZ = "UTC";
const previousPort = parseInt(process.env.PORT ?? "3000");

process.env.PORT = (previousPort + 1).toString();
console.log({ previousPort, current: process.env.PORT });
