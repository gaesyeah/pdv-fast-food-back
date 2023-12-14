import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

export function loadEnv() {
  let path: string;

  if (process.env.NODE_ENV === 'test') {
    path = '.env.test.local';
  } else if (process.env.NODE_ENV === 'development') {
    path = '.env.development.local';
  } else {
    path = '.env';
  }

  const currentEnvs = dotenv.config({ path });
  dotenvExpand.expand(currentEnvs);
}
