import { Toaster } from 'react-hot-toast';

import Form from './Form';
import './App.css';

function App() {
  return (
    <div className='app'>
      <header>
        <h1>Fetch Rewards</h1>
        <p>This form is built with:</p>
        <ul>
          <li>React</li>
          <li>TypeScript</li>
          <li>React Hook Form</li>
          <li>react-hot-toast</li>
          <li>react-spinners</li>
        </ul>
        <div className='links__container'>
          <span>My links:</span>
          <a
            href='https://github.com/ivanolmo'
            target='_blank'
            rel='noreferrer'
          >
            GitHub
          </a>
          <a
            href='https://linkedin.com/in/ivan-olmo'
            target='_blank'
            rel='noreferrer'
          >
            LinkedIn
          </a>
          <a href='https://ivanolmo.io' target='_blank' rel='noreferrer'>
            Portfolio
          </a>
        </div>
      </header>
      <Form />
      <Toaster />
    </div>
  );
}

export default App;
