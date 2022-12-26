import {useState} from 'react';
import Count from '/@/components/Count';
import {sha256sum, versions} from '#preload';
import {sum} from '#common';
console.log('From renderer package:', sum);

const APP_VERSION = import.meta.env.VITE_APP_VERSION;

export default function App() {
  const [rawValue, setRawValue] = useState('hello world');

  return (
    <div className="m-3">
      <h2>App</h2>
      <Count />
      <br />
      <div>Sum from common package: {sum}</div>
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
