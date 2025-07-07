import Navigationbar from './components/navigationbar'
import AuthForm from './components/Authentication'; 
import Home from './components/Home';
import Profile from './components/Profile';
import AuthGuard from './components/AuthGuard';
import {
    Routes,
    Route,
    useLocation
   } from 'react-router-dom';
function App() {

  const isauthpath = ["/login", "/sign-up", "/auth"].includes(useLocation().pathname);

  return (
          <AuthGuard>
           {!isauthpath && <Navigationbar />}
             <Routes>
              <Route path="/" element={<AuthForm islogin = {true} />} />
              <Route path="/sign-up" element={<AuthForm islogin = {false} />} />
              <Route path="/login" element={<AuthForm islogin = {true} />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
          </Routes>
          </AuthGuard>

          
  )
}

export default App