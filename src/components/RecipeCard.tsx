import { Clock, Star, Bot } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onViewDetail: () => void;
}

export default function RecipeCard({ recipe, isFavorite, onToggleFavorite, onViewDetail }: RecipeCardProps) {
  // Create a seed for consistent image generation based on recipe title
  const imageSeed = recipe.title.toLowerCase().replace(/\s+/g, '-');
  const imageUrl = `https://picsum.photos/seed/${imageSeed}/400/240`;

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border/50 overflow-hidden hover-lift group cursor-pointer">
      <div onClick={onViewDetail} className="relative">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* AI Generated Badge */}
          {recipe.isAIGenerated && (
            <div className="absolute top-3 left-3 flex items-center space-x-1 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
              <Bot className="h-3 w-3" />
              <span>IA</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {recipe.title}
            </h3>
          </div>

          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {recipe.description}
          </p>

          {/* Prep Time */}
          <div className="flex items-center space-x-1 text-muted-foreground mb-3">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{recipe.prepTime} min</span>
          </div>

          {/* Dietary Info */}
          <div className="flex flex-wrap gap-1 mb-3">
            {recipe.dietaryInfo.slice(0, 3).map((info, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
              >
                {info}
              </span>
            ))}
            {recipe.dietaryInfo.length > 3 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                +{recipe.dietaryInfo.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex justify-between items-center">
        <button
          onClick={onViewDetail}
          className="flex-1 mr-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-colors duration-200 text-sm font-medium"
        >
          Ver Receta
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isFavorite
              ? 'text-warning bg-warning/10 hover:bg-warning/20'
              : 'text-muted-foreground hover:text-warning hover:bg-warning/10'
          }`}
        >
          <Star className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
}