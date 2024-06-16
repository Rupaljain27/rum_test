import { AwsRum } from 'aws-rum-web';

try {
  const config = {
    sessionSampleRate: 1,
    identityPoolId: "us-east-1:1f4aa60b-6415-41ce-bb6b-1bb2aac9e2b0",
    endpoint: "https://dataplane.rum.us-east-1.amazonaws.com",
    telemetries: ["performance","http"],
    allowCookies: true,
    enableXRay: true
  };

  const APPLICATION_ID = '0d6c7d54-c31a-45b6-be39-118455091554';
  const APPLICATION_VERSION = '1.0.0';
  const APPLICATION_REGION = 'us-east-1';

  const awsRum = new AwsRum(
    APPLICATION_ID,
    APPLICATION_VERSION,
    APPLICATION_REGION,
    config
  );
} catch (error) {
  // Ignore errors thrown during CloudWatch RUM web client initialization
}

import express from "express";
import https from "https";

import indexRouter  from "./routes/index.js";
import secondRouter from "./routes/second.js";

var app = express();
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/second', secondRouter);

app.post('/request', (req, res) => {
    console.log("Request Receieved");
    res.send("Click Recorded");
})

app.listen(2024, () => {
    console.log('Running on port 2024')
});

export { app };