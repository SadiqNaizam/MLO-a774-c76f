import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, Plus, Minus, Eye } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number) => void;
  onViewDetails?: (item: MenuItem) => void; // For opening a customization/details dialog
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart, onViewDetails }) => {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  console.log(`MenuItemCard loaded for item: ${item.name}`);

  const handleIncrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCartClick = () => {
    onAddToCart(item, quantity);
    toast({
      title: "Item Added to Cart",
      description: `${quantity} x ${item.name} added to your cart.`,
      duration: 3000,
    });
    // Reset quantity to 1 after adding, if desired
    // setQuantity(1); 
  };

  return (
    <Card className="w-full overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <CardHeader className="p-0 relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={item.imageUrl || 'https://via.placeholder.com/400x225?text=Food+Item'}
            alt={item.name}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
      </CardHeader>

      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold mb-1 line-clamp-2">{item.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-2 line-clamp-3 min-h-[3.75rem] sm:min-h-[3rem]"> {/* min-h for consistency */}
          {item.description}
        </CardDescription>
        <p className="text-xl font-bold text-gray-800 dark:text-gray-200">${item.price.toFixed(2)}</p>
      </CardContent>

      <CardFooter className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleDecrementQuantity} aria-label="Decrease quantity">
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium w-8 text-center" aria-live="polite">{quantity}</span>
          <Button variant="outline" size="icon" onClick={handleIncrementQuantity} aria-label="Increase quantity">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {onViewDetails && (
            <Button variant="ghost" size="sm" onClick={() => onViewDetails(item)} className="flex-1 sm:flex-none text-primary hover:text-primary/90">
              <Eye className="mr-2 h-4 w-4" />
              Details
            </Button>
          )}
          <Button 
            onClick={handleAddToCartClick} 
            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;