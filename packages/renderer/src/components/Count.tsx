import {useState} from 'react';

export default function Count() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button
        onClick={() => {
          setCount(prev => prev + 1);
        }}
        style={{marginRight: 5}}
      >
        Click Me
      </button>
      count: {count}
    </div>
  );
}
