import React from 'react';

const Card = ({ className = '', children }) => {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ className = '', children }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

const CardTitle = ({ className = '', children }) => {
  return <h3 className={`text-lg font-medium ${className}`}>{children}</h3>;
};

const CardContent = ({ className = '', children }) => {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
};

export { Card, CardHeader, CardTitle, CardContent };