import dotenv from 'dotenv'
import path from 'path'
import { cwd } from 'process'


dotenv.config({ path: path.join(cwd(), '.env') })


export default {
  port: process.env.PORT!,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
  jwt_access_expires: process.env.JWT_ACCESS_EXPIRES!,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS!,
  stripe_secret: process.env.STRIPE_SECRET!,
  client_url: process.env.APP_URL!,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,
};



