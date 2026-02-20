import React from 'react';
import BudgetItem from './BudgetItem';

/**
 * Composant qui affiche la liste des éléments de budget.
 */
const BudgetList = ({ items }) => (
  <div className="budget-list">
    {items.map((item) => (
      <BudgetItem key={item.id} item={item} />
    ))}
  </div>
);

export default BudgetList;