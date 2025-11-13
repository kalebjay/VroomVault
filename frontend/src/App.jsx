import './App.css'

// Start a local frontend react app 
// on port 5173 using cmd 'npm run dev'
// alias npmr='npm run dev'

function App() {
  return (
    <div className="app-container">
      <button className="login-button">New User/Login</button>
      <div>
        <div>
          <h1 className="main-title">Vroom Vault</h1>
          <h2>This is your ultimate auto hub!</h2>
        </div>
        <p>Track all of your vehicles and toys all in one place!</p>
        <div>
          <button className="test-button">Test</button>
        </div>
      </div>
    </div>
  )
}

export default App
