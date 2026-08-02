import app from '.';

app.listen(3601, (server) =>
  console.log(`API is now running on ${server.url.href}`),
);
