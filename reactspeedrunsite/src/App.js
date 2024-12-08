import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SpeedrunTable from './components/speedrunTable';
import SpeedrunPage from './components/speedrunpage';
import { AuthProvider } from './authContext';
import SignUp from './loginComponents/signin';
import Login from './loginComponents/login';
import Profile from './loginComponents/profile';
import SubmitSpeedRun from './components/submitspeedrun';
import FrontPage from './components/frontPage';
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/submit" element={<SubmitSpeedRun />} />
            <Route path="/" element={<FrontPage />} />
            <Route path="/speedrun/:videoId" element={<SpeedrunPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
    
  );
}


export default App;
