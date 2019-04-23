const env = {
  API_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:8080/graphql' : '',
};

export default env;
