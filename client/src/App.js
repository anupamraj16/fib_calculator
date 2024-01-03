import React from 'react'
import logo from './logo.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import OtherPage from './OtherPage'
import Fib from './Fib'

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>
            <Link className={'link-styles'} to="/">
              Home
            </Link>
            <Link className={'link-styles'} to="/otherpage">
              Other Page
            </Link>
          </div>
        </header>
        <Routes>
          <Route exact path="/" element={<Fib />} />
          <Route path="/otherpage" element={<OtherPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
