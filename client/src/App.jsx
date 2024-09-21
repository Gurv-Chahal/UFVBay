import { useState } from 'react'
import Home from './pages/Home.jsx';
import Account from './pages/Account.jsx';
import Auth from './pages/Auth.jsx';
import { Routes, Route, BrowserRouter} from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Auth />} />
      <Route path='/account' element = {<Account />} />
      </Routes>
    
    </BrowserRouter>
  )
}

export default App
