import { useState, useMemo } from 'react';
import { Search, Filter, Clock, ArrowUpDown, Loader2, ChefHat } from 'lucide-react';
import { Recipe, SearchFilters, MEAL_TYPES, DIETARY_PREFERENCES, Ingredient } from '../types';
import { findRecipes } from '../services/geminiService';
import { useLocalStorage } from '../hooks/useLocalStorage';
import RecipeCard from './RecipeCard';
import RecipeDetailModal from './RecipeDetailModal';

type SortOption = 'relevance' | 'time-asc' | 'time-desc' | 'title';

export default function RecipeSearch() {
  const [pantryIngredients] = useLocalStorage<Ingredient[]>('pantry', []);
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
  const [history, setHistory] = useLocalStorage<Recipe[]>('history', []);
  
  const [filters, setFilters] = useState<SearchFilters>({
    mealType: '',
    ingredientQuery: '',
    dietaryPreferences: []
  });
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  // Sort recipes based on selected option
  const sortedRecipes = useMemo(() => {
    const sorted = [...recipes];
    switch (sortBy) {
      case 'time-asc':
        return sorted.sort((a, b) => a.prepTime - b.prepTime);
      case 'time-desc':
        return sorted.sort((a, b) => b.prepTime - a.prepTime);
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted; // Keep original relevance order
    }
  }, [recipes, sortBy]);

  const handleSearch = async () => {
    if (!filters.mealType && !filters.ingredientQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await findRecipes(filters, pantryIngredients);
      setRecipes(results);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching recipes:', error);
      // Handle error - could show toast notification
    } finally {
      setLoading(false);
    }
  };

  const toggleDietaryPreference = (preference: string) => {
    setFilters(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter(p => p !== preference)
        : [...prev.dietaryPreferences, preference]
    }));
  };

  const toggleFavorite = (recipeTitle: string) => {
    setFavorites(prev =>
      prev.includes(recipeTitle)
        ? prev.filter(title => title !== recipeTitle)
        : [...prev, recipeTitle]
    );
  };

  const viewRecipeDetail = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    
    // Add to history if not already there
    setHistory(prev => {
      const isAlreadyInHistory = prev.some(r => r.title === recipe.title);
      if (isAlreadyInHistory) return prev;
      return [recipe, ...prev].slice(0, 20); // Keep only last 20
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-slide-up">
      {/* Search Form */}
      <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
        <div className="flex items-center space-x-2 mb-6">
          <Search className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Búsqueda de Recetas Saludables</h2>
        </div>

        <div className="space-y-6">
          {/* Meal Type & Ingredient Query */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Comida</label>
              <select
                value={filters.mealType}
                onChange={(e) => setFilters(prev => ({ ...prev, mealType: e.target.value }))}
                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              >
                <option value="">Seleccionar tipo</option>
                {MEAL_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ingrediente Principal</label>
              <input
                type="text"
                placeholder="Ej: pollo, quinoa, aguacate..."
                value={filters.ingredientQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, ingredientQuery: e.target.value }))}
                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              />
            </div>
          </div>

          {/* Dietary Preferences */}
          <div>
            <label className="block text-sm font-medium mb-3">Preferencias Alimentarias</label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_PREFERENCES.map(preference => (
                <button
                  key={preference}
                  onClick={() => toggleDietaryPreference(preference)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filters.dietaryPreferences.includes(preference)
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }`}
                >
                  {preference}
                </button>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading || (!filters.mealType && !filters.ingredientQuery.trim())}
            className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
            <span>{loading ? 'Buscando...' : 'Buscar Recetas'}</span>
          </button>
        </div>
      </div>

      {/* Sort Controls */}
      {recipes.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {recipes.length} receta{recipes.length !== 1 ? 's' : ''} encontrada{recipes.length !== 1 ? 's' : ''}
          </p>
          
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            >
              <option value="relevance">Relevancia</option>
              <option value="time-asc">Tiempo ↑</option>
              <option value="time-desc">Tiempo ↓</option>
              <option value="title">Título A-Z</option>
            </select>
          </div>
        </div>
      )}

      {/* Results */}
      <div>
        {!hasSearched ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border/50">
            <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              ¡Descubre Recetas Saludables!
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Utiliza los filtros de arriba para encontrar recetas perfectas que se adapten a tus gustos y ingredientes disponibles.
            </p>
          </div>
        ) : loading ? (
          <div className="text-center py-16">
            <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Generando recetas personalizadas...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border/50">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No se encontraron recetas
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Intenta ajustar los filtros de búsqueda o agregar más ingredientes a tu despensa.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRecipes.map((recipe, index) => (
              <RecipeCard
                key={`${recipe.title}-${index}`}
                recipe={recipe}
                isFavorite={favorites.includes(recipe.title)}
                onToggleFavorite={() => toggleFavorite(recipe.title)}
                onViewDetail={() => viewRecipeDetail(recipe)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          isFavorite={favorites.includes(selectedRecipe.title)}
          onToggleFavorite={() => toggleFavorite(selectedRecipe.title)}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}