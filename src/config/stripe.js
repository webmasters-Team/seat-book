import dotenv from "dotenv";
dotenv.config("/.env");
export const sk = process.env.STRIPE_SECRET_KEY;

export const wh = process.env.WH_SECRET;

const x = {
  team1: {
    flag: "https://vrinsitu-aaron-bucket.s3.amazonaws.com/flags/flagVenezue.png",
    name: "Venezuela",
  },
  team2: {
    flag: "https://vrinsitu-aaron-bucket.s3.amazonaws.com/flags/flag-Argentina.png",
    name: "Argentina",
  },
  matchLocation: "Por definirse",
  matchDescription:
    "Este encuentro se llevará a cabo el próximo 10 de Octubre",
  dateUTC: "2024-11-10T00:00:00Z",
  dateString: "10 de Octubre 2024",
  amount: 50,
  match: "Venezuela vs Argentina",
};
