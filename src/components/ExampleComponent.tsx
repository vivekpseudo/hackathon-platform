import React from 'react';

const ExampleComponent: React.FC = () => {
  return (
    <div className="bg-blue-200 p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold text-blue-700 mb-2">Welcome to the Hackathon Platform!</h2>
      <p className="text-gray-600">This is a simple example component styled with Tailwind CSS.</p>
      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
        Get Started
      </button>
    </div>
  );
};

export default ExampleComponent;