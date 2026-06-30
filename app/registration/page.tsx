'use client'
import { useState } from "react";

export default function Registration() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (

      <div className="flex flex-col border-3 border-teal-500 justify-center items-center gap-15  h-150 w-230 rounded-md bg-teal-500">

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username..."
          className="rounded-sm border border-blue-600  focus:outline-none focus:border-gray w-80 h-10 text-teal-500 bg-white px-3"
        />
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password..."
          className="rounded-sm w-80 h-10 text-teal-500 bg-white border border-blue-600 focus:outline-none focus:border-gray px-3"
        />

        <button className="bg-white rounded-xl w-20 h-10 text-teal-500">
          Register
        </button>


      </div>
  );
}