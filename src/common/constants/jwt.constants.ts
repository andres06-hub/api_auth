import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

config({ path: '.secret.key' });

export const JWTKEYS = {
  //TODO: File Read for the key secret
  secret: 'holaMundo',
  // secret: readFileSync(join(process.cwd(), '.secret', 'sign.key')),
};
