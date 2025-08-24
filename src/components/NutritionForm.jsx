// src/components/NutritionForm.jsx

import { useState } from 'react';

export default function NutritionForm({ onAddMeal }) {
  const [mealType, setMealType] = useState('Breakfast');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description) return;
    // Simple logic to determine meal balance for this example
    const balance = description.toLowerCase().includes('salad') ? 'Balanced' : 'High-Carb';
    onAddMeal({ mealType, description, balance });
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 w-full">
      <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Log a Meal</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
         className="p-2 rounded-lg border bg-white/80 dark:bg-gray-700 dark:text-gray-100"
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
        >
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
        </select>
        <input
    type="text"
    // ...
    // And here
    className="md:col-span-2 p-2 rounded-lg border bg-white/80 dark:bg-gray-700 dark:text-gray-100"
  />
      </div>
      <button type="submit" className="mt-4 w-full py-2 bg-indigo-500 text-white rounded-lg font-semibold">
        Add Meal
      </button>
    </form>
  );
}