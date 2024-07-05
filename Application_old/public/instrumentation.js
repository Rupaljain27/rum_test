import { AwsRum } from './aws-rum-web';

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

// Button Instrumentation
var toTrack = document.querySelectorAll(".track_btn").length;
console.log(toTrack);
for (var i = 0; i < toTrack; i++) {
    document.querySelectorAll(".track_btn")[i].addEventListener("click", event => {
        awsRum.recordEvent(event.target.id, {
            user_interaction: {
                interaction_1: "click"
            }
        });
        console.log("Button Pressed");
    })
}