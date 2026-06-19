import React from 'react';

interface PlaceholderProps {
  title: string;
}

/**
 * Simple placeholder component used while the real pages are not yet implemented.
 * It displays a centered title so the routing can be verified.
 */
const Placeholder: React.FC<PlaceholderProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    </div>
  );
};

export default Placeholder;
