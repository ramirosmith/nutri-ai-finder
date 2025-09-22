import { useState, useMemo } from 'react';
import { Plus, Search, X, Package2 } from 'lucide-react';
import { Ingredient, SUGGESTED_INGREDIENTS, INGREDIENT_CATEGORIES } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function PantryManager() {
  const [pantryIngredients, setPantryIngredients] = useLocalStorage<Ingredient[]>('pantry', []);
  const [newIngredient, setNewIngredient] = useState({ name: '', category: 'Otros' as Ingredient['category'] });
  const [searchTerm, setSearchTerm] = useState('');

  // Filter pantry ingredients by search term
  const filteredPantry = useMemo(() => {
    return pantryIngredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pantryIngredients, searchTerm]);

  // Group filtered ingredients by category
  const groupedIngredients = useMemo(() => {
    const grouped: Record<string, Ingredient[]> = {};
    filteredPantry.forEach(ingredient => {
      if (!grouped[ingredient.category]) {
        grouped[ingredient.category] = [];
      }
      grouped[ingredient.category].push(ingredient);
    });
    return grouped;
  }, [filteredPantry]);

  // Filter suggested ingredients (only show those not in pantry)
  const availableSuggestions = useMemo(() => {
    const pantryNames = pantryIngredients.map(ing => ing.name.toLowerCase());
    return SUGGESTED_INGREDIENTS.filter(suggestion => 
      !pantryNames.includes(suggestion.name.toLowerCase())
    );
  }, [pantryIngredients]);

  const addIngredient = (ingredient: Omit<Ingredient, 'id'>) => {
    const newIng: Ingredient = {
      ...ingredient,
      id: Date.now().toString()
    };
    setPantryIngredients(prev => [...prev, newIng]);
  };

  const removeIngredient = (id: string) => {
    setPantryIngredients(prev => prev.filter(ing => ing.id !== id));
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredient.name.trim()) return;
    
    addIngredient({
      name: newIngredient.name.trim(),
      category: newIngredient.category
    });
    setNewIngredient({ name: '', category: 'Otros' });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-slide-up">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Gestor de Despensa</h2>
        <p className="text-muted-foreground">
          Administra los ingredientes que tienes disponibles en casa
        </p>
      </div>

      {/* Add Custom Ingredient Form */}
      <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Plus className="h-5 w-5 text-primary" />
          <span>Agregar Ingrediente Personalizado</span>
        </h3>
        
        <form onSubmit={handleAddCustom} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Nombre del ingrediente"
            value={newIngredient.name}
            onChange={(e) => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
            className="flex-1 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          />
          
          <select
            value={newIngredient.category}
            onChange={(e) => setNewIngredient(prev => ({ ...prev, category: e.target.value as Ingredient['category'] }))}
            className="px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          >
            {INGREDIENT_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-colors duration-200 font-medium"
          >
            Agregar
          </button>
        </form>
      </div>

      {/* Suggested Ingredients */}
      {availableSuggestions.length > 0 && (
        <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
          <h3 className="text-lg font-semibold mb-4">Ingredientes Sugeridos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableSuggestions.map((ingredient, index) => (
              <button
                key={index}
                onClick={() => addIngredient(ingredient)}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left group"
              >
                <div>
                  <p className="font-medium text-sm">{ingredient.name}</p>
                  <p className="text-xs text-muted-foreground">{ingredient.category}</p>
                </div>
                <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar en tu despensa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
        />
      </div>

      {/* Pantry Contents */}
      <div className="space-y-6">
        {Object.keys(groupedIngredients).length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border/50">
            <Package2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              {searchTerm ? 'No se encontraron ingredientes' : 'Tu despensa está vacía'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? 'Intenta con otro término de búsqueda' 
                : 'Comienza agregando algunos ingredientes que tengas disponibles'
              }
            </p>
          </div>
        ) : (
          Object.entries(groupedIngredients).map(([category, ingredients]) => (
            <div key={category} className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
              <h3 className="text-lg font-semibold mb-4 text-primary">{category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {ingredients.map(ingredient => (
                  <div
                    key={ingredient.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg group hover:bg-muted transition-colors duration-200"
                  >
                    <span className="font-medium text-sm">{ingredient.name}</span>
                    <button
                      onClick={() => removeIngredient(ingredient.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}