import React from 'react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface Cuisine {
  id: string;
  name: string;
  imageUrl: string; // URL to an icon or representative image
}

interface CuisineSelectorProps {
  cuisines: Cuisine[];
  onSelectCuisine: (cuisineId: string) => void;
  title?: string; // Optional title like "Choose your favorite cuisine"
}

const CuisineSelector: React.FC<CuisineSelectorProps> = ({ cuisines, onSelectCuisine, title }) => {
  console.log('CuisineSelector loaded');

  if (!cuisines || cuisines.length === 0) {
    return (
      <div className="py-8">
        {title && (
          <h2 className="text-2xl font-bold mb-6 text-center">
            {title}
          </h2>
        )}
        <p className="text-center text-gray-500">No cuisines available at the moment.</p>
      </div>
    );
  }

  return (
    <section className="py-8" aria-labelledby={title ? "cuisine-selector-title" : undefined}>
      {title && (
        <h2 id="cuisine-selector-title" className="text-2xl font-bold mb-6 text-center sm:text-left">
          {title}
        </h2>
      )}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4">
          {cuisines.map((cuisine) => (
            <div
              key={cuisine.id}
              className="inline-block cursor-pointer group w-32 sm:w-36 flex-shrink-0" // Added flex-shrink-0
              onClick={() => onSelectCuisine(cuisine.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault(); // Prevent page scroll on spacebar
                  onSelectCuisine(cuisine.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Select ${cuisine.name} cuisine`}
            >
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary h-full">
                <CardContent className="flex flex-col items-center justify-center p-3 space-y-2 h-full">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={cuisine.imageUrl || `https://via.placeholder.com/100?text=${encodeURIComponent(cuisine.name)}`}
                      alt={cuisine.name}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-sm font-medium text-center truncate w-full pt-1">{cuisine.name}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
};

export default CuisineSelector;