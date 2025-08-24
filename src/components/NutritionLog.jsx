// src/components/NutritionLog.jsx

export default function NutritionLog({ meals }) {
  const todaysMeals = meals.filter(meal =>
    new Date(meal.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="glass-card p-6 w-full">
      <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Today's Nutrition Log</h3>
      {todaysMeals.length === 0 ? (
        <p className="opacity-70 text-center">No meals logged for today.</p>
      ) : (
        <ul className="space-y-3">
          {todaysMeals.map((meal, index) => (
            <li key={index} className="flex justify-between items-center bg-white/50 dark:bg-gray-700/50 p-3 rounded-lg">
              <div>
                <span className="font-bold">{meal.mealType}: </span>
                <span>{meal.description}</span>
              </div>
              <span className="text-sm font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {meal.balance}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}