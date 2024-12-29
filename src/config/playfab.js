import dotenv from 'dotenv';
dotenv.config();

export const playfabConfig = {
    titleId: process.env.TILTE_ID,
    secretKey:  process.env.SECRET_KEY
  };