import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SpeedrunTable from './components/speedrunTable';
import SpeedrunPage from './components/speedrunpage';
import { AuthProvider } from './authContext';
import SignUp from './loginComponents/signin';
import Login from './loginComponents/login';
import Profile from './loginComponents/profile';
import SubmitSpeedRun from './components/submitspeedrun';
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<SpeedrunTable />} />
            <Route path="/submit" element={<SubmitSpeedRun />} />
            <Route path="/speedrun/:id" element={<SpeedrunPage />} /> 
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
