import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star, Clock, Truck } from 'lucide-react';

interface RestaurantCardProps {
  id: string;
  imageUrl: string;
  name: string;
  cuisineTypes: string[];
  rating: number;
  reviewCount?: number;
  deliveryTime: string;
  deliveryFee: string; // e.g., "$2.99" or "Free"
  minimumOrderValue?: number;
  // Optional: Add a slug if needed for SEO-friendly URLs, though App.tsx currently points to /restaurant-detail without params.
  // slug?: string; 
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  imageUrl,
  name,
  cuisineTypes,
  rating,
  reviewCount,
  deliveryTime,
  deliveryFee,
  minimumOrderValue,
}) => {
  console.log('RestaurantCard loaded for:', name);

  return (
    <Link to={`/restaurant-detail?id=${id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
      <Card className="w-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl group bg-card text-card-foreground flex flex-col h-full">
        <CardHeader className="p-0 relative">
          <AspectRatio ratio={16 / 9}>
            <img
              src={imageUrl || 'https://via.placeholder.com/400x225?text=Restaurant'}
              alt={`Image of ${name}`}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
          {/* Potential placeholder for future badges like "Featured" or "Offer" */}
          {/* <Badge variant="destructive" className="absolute top-2 right-2">Offer</Badge> */}
        </CardHeader>

        <CardContent className="p-4 space-y-2 flex-grow">
          <CardTitle className="text-xl font-semibold tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </CardTitle>
          
          {cuisineTypes && cuisineTypes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {cuisineTypes.slice(0, 3).map((cuisine, index) => ( // Show max 3 cuisines for brevity
                <Badge key={`${id}-cuisine-${index}`} variant="secondary" className="text-xs">
                  {cuisine}
                </Badge>
              ))}
              {cuisineTypes.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{cuisineTypes.length - 3} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center pt-1 space-x-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
            {reviewCount && <span>({reviewCount}{reviewCount > 0 ? '+' : ''} reviews)</span>}
          </div>
        </CardContent>

        <CardFooter className="p-4 border-t bg-muted/30 text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row justify-between w-full gap-y-2 gap-x-4">
            <div className="flex items-center">
              <Clock className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
              <span>{deliveryTime}</span>
            </div>
            <div className="flex items-center">
              <Truck className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
              <span>{deliveryFee}</span>
              {minimumOrderValue && minimumOrderValue > 0 && (
                <span className="ml-1 sm:ml-2">• ${minimumOrderValue.toFixed(2)} min</span>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default RestaurantCard;