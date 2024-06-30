import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate  } from "react-router-dom";

import { AwsRum } from 'aws-rum-web';
import { useEffect } from 'react';

let awsRum = null;

try {
  const config = {
    sessionSampleRate: 1,
    identityPoolId: "us-east-1:1f4aa60b-6415-41ce-bb6b-1bb2aac9e2b0",
    endpoint: "https://dataplane.rum.us-east-1.amazonaws.com",
    telemetries: ["performance", "http"],
    allowCookies: true,
    enableXRay: true
  };

  const APPLICATION_ID = '0d6c7d54-c31a-45b6-be39-118455091554';
  const APPLICATION_VERSION = '1.0.0';
  const APPLICATION_REGION = 'us-east-1';

  awsRum = new AwsRum(
    APPLICATION_ID,
    APPLICATION_VERSION,
    APPLICATION_REGION,
    config
  );
  console.log("AWS RUM initialized:", awsRum);
} catch (error) {
  // Ignore errors thrown during CloudWatch RUM web client initialization
  console.error("Failed to initialize AWS RUM:", error);
}

const CloudWatchRUM = () => {
  useEffect(() => {
    (function (n, i, v, r, s, c, x, z) { x = window.AwsRumClient = { q: [], n: n, i: i, v: v, r: r, c: c }; window[n] = function (c, p) { x.q.push({ c: c, p: p }); }; z = document.createElement('script'); z.async = true; z.src = s; document.head.insertBefore(z, document.head.getElementsByTagName('script')[0]); })(
      'cwr',
      '0d6c7d54-c31a-45b6-be39-118455091554',
      '1.0.0',
      'us-east-1',
      'https://client.rum.us-east-1.amazonaws.com/1.16.1/cwr.js',
      {
        sessionSampleRate: 1,
        identityPoolId: "us-east-1:1f4aa60b-6415-41ce-bb6b-1bb2aac9e2b0",
        endpoint: "https://dataplane.rum.us-east-1.amazonaws.com",
        telemetries: ["performance", "http"],
        allowCookies: true,
        enableXRay: true
      }
    );
    console.log("AWS RUM script injected");
  }, []);

  return null;
};

const EventListener = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(".track_btn, .track_link");

    elements.forEach(element => {
      element.addEventListener("click", event => {
        console.log("Event captured:", event.target.id);
        const eventType = event.target.getAttribute("data-event-type");
        if (awsRum) {
          awsRum.recordEvent(eventType, {
            user_interaction: {
              interaction_1: "click"
            }
          });
          console.log("Event recorded with AWS RUM:", event.target.id);
        } else {
          console.error("AWS RUM is not initialized");
        }
        // if (window.cwr) {
        //   window.cwr("recordEvent", {
        //     type: 'button_called',
        //     data: {
        //       current_url: "/",
        //       user_interaction: {
        //         interaction_1: "click"
        //       }
        //     }
        //   });
        //   console.log("cwr recordEvent called");
        // } else {
        //   console.error("cwr is not initialized");
        // }
      });
    });

  }, []);

  return null;
};

export default function App() {
  return (
    <Router>
      {/* <CloudWatchRUM /> */}
      <EventListener />
      <div>
        <p><Link to="/" className="track_link" id="home_link" data-event-type="home_link_click">Home</Link></p>
        <p><Link to="/about" className="track_link" id="about_link" data-event-type="about_link_click">About</Link></p>
        <p><Link to="/users" className="user_link" id="home_link" data-event-type="users_link_click">Users</Link></p>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/users" element={<Users />} />
          <Route exact path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  )
}

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <h2>Home</h2>
      <button className="track_btn" id="home_button" data-event-type="home_button_click" onClick={() => navigate("/about")}>Go to About</button>
      <button className="track_btn" id="users_button" data-event-type="users_button_click" onClick={() => navigate("/users")}>Go to User</button>
      {/* <Routes>
        <Route exact path="*" element={<Home />} />
      </Routes> */}
    </div>
  );
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  const navigate = useNavigate();
  return <div>
    <h2>Users</h2>
    <p><Link to="/user/1">User 1</Link></p>
    <p><Link to="/user/2">User 2</Link></p>
    <p><Link to="/user/3">User 3</Link></p>
    <button className="track_btn" id="user_button" data-event-type="user_button_click" onClick={() => navigate("/")}>Go to Home</button>
    {/* <Routes>
      <Route exact path="/" element={<Home />} />
    </Routes> */}
  </div>
    ;
}
