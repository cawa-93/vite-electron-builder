import {useState} from 'react';
import Count from '/@/components/Count';
import {sha256sum, versions} from '#preload';

const APP_VERSION = import.meta.env.VITE_APP_VERSION;

export default function App() {
  const [rawValue, setRawValue] = useState('hello world');

  return (
    <div>
      <h2>App</h2>
      <Count />
      <br />
      <div>App version: {APP_VERSION}</div>
      <ul id="process-versions">
        {Object.entries(versions).map(([lib, version], idx) => {
          return (
            <li key={idx}>
              <strong>{lib}</strong>
              <span>: v{version}</span>
            </li>
          );
        })}
      </ul>
      <br />
      <label>
        Raw value
        <input
          type="text"
          value={rawValue}
          onChange={e => {
            setRawValue(e.target.value);
          }}
        />
      </label>
      <br />
      <label>
        Hashed by node:crypto
        <input
          type="text"
          disabled
          value={sha256sum(rawValue)}
        />
      </label>
    </div>
  );
}
