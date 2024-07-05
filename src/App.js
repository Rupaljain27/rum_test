import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { AwsRum } from 'aws-rum-web';
import { v4 as uuidv4 } from 'uuid';

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

// Simulate a text file with user data
const usersData = `
  test1, password123
  test2, mypassword
  admin, adminpassword
`;

const parseUsers = (data) => {
  return data.trim().split('\n').map(line => {
    const [username, password] = line.trim().split(', ');
    return { username, password };
  });
};

const users = parseUsers(usersData);

const EventListener = ({ user }) => {
  useEffect(() => {
    const elements = document.querySelectorAll(".track_btn, .track_link");

    elements.forEach(element => {
      element.addEventListener("click", event => {
        console.log("Event captured:", event.target.id);
        const eventType = event.target.getAttribute("data-event-type");
        if (awsRum) {
          awsRum.recordEvent(eventType, {
            user_details: {
              userId: user.userId,
              sessionId: user.sessionId
            },
            event_details: {
              user_interaction: {
                interaction_1: "click"
              },
              user_info: {
                username: user.username,
                sessionId: new Date().getTime() 
              }
            }
          });
          console.log("Event recorded with AWS RUM:", event.target.id);
        } else {
          console.error("AWS RUM is not initialized");
        }
      });
    });

  }, [user]);

  return null;
};

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = uuidv4(); // Generate a unique user ID if not present
        localStorage.setItem('userId', userId); // Store userId in local storage
      }
      // const userId = uuidv4(); // Generate a unique user ID
      const sessionId = uuidv4(); // Generate a unique session ID
      setUser({ userId, username: user.username, sessionId });

      console.log(`User logged in: ${user.username}, Session ID: ${sessionId}`);
      navigate("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Enter username"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
      console.log(`User restored from local storage: ${savedUser.username}, User ID: ${savedUser.userId}, Session ID: ${savedUser.sessionId}`);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      console.log(`User state updated: ${user.username}, User ID: ${user.userId}, Session ID: ${user.sessionId}`);
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <Router>
      {user && <EventListener user={user} />}
      <EventListener />
      <div>
        {!user ? (
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="*" element={<Login setUser={setUser} />} />
          </Routes>
        ) : (
          <>
            <p>
              <button onClick={() => {
                console.log(`User logged out: ${user.username}, Session ID: ${user.sessionId}`);
                setUser(null);
              }}>Logout</button>
            </p>
            <p><Link to="/" className="track_link" id="home_link" data-event-type="home_link_click">Home</Link></p>
            <p><Link to="/about" className="track_link" id="about_link" data-event-type="about_link_click">About</Link></p>
            <p><Link to="/users" className="user_link" id="home_link" data-event-type="users_link_click">Users</Link></p>
            <Routes>
              <Route path="/about" element={<About />} />
              <Route path="/users" element={<Users />} />
              <Route exact path="/" element={<Home />} />
            </Routes>
          </>
        )}
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
    </div>
  );
}

function About() {
  const navigate = useNavigate();
  return (
    <div>
      <h2>About</h2>
      <button className="track_btn" id="home_button" data-event-type="home_button_click" onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
}

function Users() {
  const navigate = useNavigate();
  return <div>
    <h2>Users</h2>
    {/* <p><Link to="/user/1">User 1</Link></p>
    <p><Link to="/user/2">User 2</Link></p>
    <p><Link to="/user/3">User 3</Link></p> */}
    <button className="track_btn" id="user_button" data-event-type="user_button_click" onClick={() => navigate("/")}>Go to Home</button>
  </div>
    ;
}
