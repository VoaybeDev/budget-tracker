import React from 'react';
import './App.css';
import BudgetApp from './components/BudgetApp';

/**
 * Composant principal de l'application.
 * Affiche l'application de gestion de budget.
 */
function App() {
  return (
    <div className="App">
      <BudgetApp />
    </div>
  );
}

export default App;