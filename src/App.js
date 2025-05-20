import { useState } from 'react';
import './App.css';
import PasswordInput from './components/PasswordInput';
import Chat from './components/Chat';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const handlePasswordSuccess = () => {
    setIsAuthenticated(true);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        {!isAuthenticated ? (
          <PasswordInput onSuccess={handlePasswordSuccess} />
        ) : (
          <Chat />
        )}
      </header>
    </div>
  );
}

export default App;
