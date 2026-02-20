import React from 'react';

/**
 * Composant représentant un élément du budget (revenu ou dépense).
 */
const BudgetItem = ({ item }) => (
  <div className={`budget-item ${item.type}`}>
    <span>{item.name}</span>
    <span>{item.amount} €</span>
  </div>
);

export default BudgetItem;