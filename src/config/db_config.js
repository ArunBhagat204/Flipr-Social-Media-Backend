const dbAuth = {
  username: process.env.MONGO_USERNAME,
  password: process.env.MONGO_PASSWORD,
};

const dbURI = `mongodb+srv://${dbAuth.username}:${dbAuth.password}@social-media-app.1kaxc.mongodb.net/social-media-db?retryWrites=true&w=majority`;

module.exports = { dbURI };
