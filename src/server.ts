import app from "./app"
import config from "./config"
import { prisma } from "./lib/prisma"


const main = async () => {
  await prisma.$connect()
  console.log('prisma db connect')
  app.listen(config.port, () => {
    console.log(`server is run ${config.port}`);
  })
}

main().catch(async e => {
  console.error(e);
  await prisma.$disconnect();
  
});