import { Utensils, Package } from 'lucide-react';
import { ActiveView } from '../types';

interface HeaderProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
}

export default function Header({ activeView, onViewChange }: HeaderProps) {
  return (
    <header className="bg-card shadow-soft border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Utensils className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-gradient">
              Healthy Finder
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => onViewChange('search')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeView === 'search'
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background'
              }`}
            >
              <Utensils className="h-4 w-4" />
              <span>Búsqueda de Recetas</span>
            </button>
            
            <button
              onClick={() => onViewChange('pantry')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeView === 'pantry'
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background'
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Gestor de Despensa</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}