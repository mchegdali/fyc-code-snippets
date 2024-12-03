const config = {
  PORT: 3001,
  brokerUrl: "http://localhost:3002",
  get subscriberUrl() {
    return `http://localhost:${this.PORT}`;
  },
};

export default config;
