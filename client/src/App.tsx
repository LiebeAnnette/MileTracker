import React from 'react';
import TripForm from './components/TripForm';
import TripDashboard from './components/TripDashboard';
import TripPDFButton from './components/TripPDFButton';

const App: React.FC = () => {
  return (
    <div>
      <h1>MileTracker</h1>
      <TripForm />
      <TripDashboard />
      <TripPDFButton />
    </div>
  );
};

export default App;
