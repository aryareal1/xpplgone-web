import app from './app';

app.listen(process.env.PORT ?? 3601, (server) =>
  console.log(`API is now running on ${server.url.href}`),
);
