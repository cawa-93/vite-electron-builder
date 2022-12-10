import {useState} from 'react';

export default function Count() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button
        onClick={() => {
          setCount(prev => prev + 1);
        }}
      >
        Click Me
      </button>
      {count}
    </div>
  );
}
