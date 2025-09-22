import { X, Clock, Users, Star, Bot, Heart } from 'lucide-react';
import { Recipe } from '../types';
import { useEffect } from 'react';

interface RecipeDetailModalProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
}

export default function RecipeDetailModal({ 
  recipe, 
  isFavorite, 
  onToggleFavorite, 
  onClose 
}: RecipeDetailModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const imageSeed = recipe.title.toLowerCase().replace(/\s+/g, '-');
  const imageUrl = `https://picsum.photos/seed/${imageSeed}/800/400`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card rounded-xl shadow-strong max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="relative">
          <img
            src={imageUrl}
            alt={recipe.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Title Overlay */}
          <div className="absolute bottom-6 left-6 right-16">
            <div className="flex items-center space-x-2 mb-2">
              {recipe.isAIGenerated && (
                <div className="flex items-center space-x-1 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-sm font-medium">
                  <Bot className="h-4 w-4" />
                  <span>Generado por IA</span>
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{recipe.title}</h1>
            <p className="text-white/90 text-lg">{recipe.description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span className="font-medium">{recipe.prepTime} minutos</span>
            </div>
            
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Users className="h-5 w-5" />
              <span className="font-medium">2-4 porciones</span>
            </div>

            <button
              onClick={onToggleFavorite}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isFavorite
                  ? 'bg-warning/10 text-warning border border-warning/30'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-transparent'
              }`}
            >
              <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              <span className="font-medium">
                {isFavorite ? 'En Favoritos' : 'Agregar a Favoritos'}
              </span>
            </button>
          </div>

          {/* Dietary Info */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Información Dietética</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.dietaryInfo.map((info, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {info}
                </span>
              ))}
            </div>
          </div>

          {/* Health Benefits */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center space-x-2">
              <Heart className="h-5 w-5 text-success" />
              <span>Beneficios para la Salud</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recipe.healthBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Ingredientes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">{ingredient.name}</span>
                  <span className="text-muted-foreground">{ingredient.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preparation Steps */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Instrucciones de Preparación</h3>
            <div className="space-y-4">
              {recipe.steps.map((step, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-muted-foreground pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}