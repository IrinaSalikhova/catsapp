// App.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [message, setMessage] = useState('');
    const [count, setCount] = useState(0)

    useEffect(() => {
      axios.get('/api/hello') // Relative path works on the same domain
          .then((response) => setMessage(response.data.message))
          .catch((error) => console.error('Error fetching data:', error));
  }, []);

    return (
      <div>
        <div>
            <h1>Frontend Connected to Backend</h1>
            <p>{message}</p>
        </div>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
      </div>

    );
};

export default App;
  