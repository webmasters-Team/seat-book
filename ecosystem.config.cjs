module.exports = {
  apps: [
    {
      name: 'vr-seat-back', // Cambia esto al nombre que desees para tu aplicación
      script: 'node src/index.js',
      env: {
        NODE_ENV: 'production',
        TILTE_ID: process.env.TILTE_ID,
        SECRET_KEY: process.env.SECRET_KEY,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        S_SECRET_KEY: process.env.S_SECRET_KEY,
        URL_PATH: process.env.URL_PATH,
        PORT: process.env.PORT,
        WH_SECRET: process.env.WH_SECRET,
        MONGO_URI: process.env.MONGO_URI,
      },
    },
  ],
};
