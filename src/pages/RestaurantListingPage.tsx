import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

// Custom Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FilterSidebar, { AppliedFilters } from '@/components/FilterSidebar';
import RestaurantCard from '@/components/RestaurantCard';

// Shadcn/ui Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // SheetTrigger is not used directly here, button triggers sheet
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// Lucide Icons
import { Search, SlidersHorizontal } from 'lucide-react';

interface Restaurant {
  id: string;
  imageUrl: string;
  name: string;
  cuisineTypes: string[];
  rating: number;
  reviewCount?: number;
  deliveryTimeMinutes: number; // For filtering
  deliveryTime: string; // For display
  deliveryFee: string;
  minimumOrderValue?: number;
  priceTier?: number; // For price range filter (e.g. 1-5, or average meal cost)
  dietaryOptions?: string[]; // For dietary filter
}

const ITEMS_PER_PAGE = 9;

// Sample Restaurant Data
const sampleRestaurants: Restaurant[] = [
  { id: '1', name: 'Pizza Heaven', cuisineTypes: ['Italian', 'Pizza'], rating: 4.5, reviewCount: 150, deliveryTimeMinutes: 30, deliveryTime: '25-35 min', deliveryFee: '$2.99', minimumOrderValue: 10, priceTier: 30, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', dietaryOptions: ['vegetarian'] },
  { id: '2', name: 'Sushi World', cuisineTypes: ['Japanese', 'Sushi'], rating: 4.8, reviewCount: 200, deliveryTimeMinutes: 45, deliveryTime: '40-50 min', deliveryFee: 'Free', minimumOrderValue: 20, priceTier: 50, imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3VzaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', dietaryOptions: ['gluten-free'] },
  { id: '3', name: 'Burger Barn', cuisineTypes: ['American', 'Burgers'], rating: 4.2, reviewCount: 120, deliveryTimeMinutes: 25, deliveryTime: '20-30 min', deliveryFee: '$1.99', priceTier: 25, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60' },
  { id: '4', name: 'Taco Fiesta', cuisineTypes: ['Mexican'], rating: 4.6, reviewCount: 180, deliveryTimeMinutes: 35, deliveryTime: '30-40 min', deliveryFee: '$3.50', minimumOrderValue: 15, priceTier: 20, imageUrl: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGFjb3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', dietaryOptions: ['vegan', 'vegetarian'] },
  { id: '5', name: 'Curry House', cuisineTypes: ['Indian'], rating: 4.7, reviewCount: 220, deliveryTimeMinutes: 50, deliveryTime: '45-55 min', deliveryFee: 'Free', minimumOrderValue: 25, priceTier: 40, imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a0586276d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', dietaryOptions: ['halal', 'vegetarian'] },
  { id: '6', name: 'Pasta Palace', cuisineTypes: ['Italian', 'Pasta'], rating: 4.3, reviewCount: 90, deliveryTimeMinutes: 40, deliveryTime: '35-45 min', deliveryFee: '$2.00', priceTier: 35, imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFzdGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
  { id: '7', name: 'Salad Sensations', cuisineTypes: ['Healthy', 'Salads'], rating: 4.9, reviewCount: 110, deliveryTimeMinutes: 20, deliveryTime: '15-25 min', deliveryFee: '$4.00', priceTier: 28, imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2FsYWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', dietaryOptions: ['vegetarian', 'vegan', 'gluten-free'] },
  { id: '8', name: 'Breakfast Nook', cuisineTypes: ['American', 'Breakfast'], rating: 4.4, reviewCount: 75, deliveryTimeMinutes: 30, deliveryTime: '25-35 min', deliveryFee: '$1.50', priceTier: 22, imageUrl: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnJlYWtmYXN0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60' },
  { id: '9', name: 'Thai Spice', cuisineTypes: ['Thai'], rating: 4.6, reviewCount: 130, deliveryTimeMinutes: 55, deliveryTime: '50-60 min', deliveryFee: '$3.00', priceTier: 45, imageUrl: 'https://images.unsplash.com/photo-1504283118737-3181b355a965?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGhhaSUyMGZvb2R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', dietaryOptions: ['vegetarian'] },
  { id: '10', name: 'BBQ Kings', cuisineTypes: ['American', 'BBQ'], rating: 4.1, reviewCount: 160, deliveryTimeMinutes: 60, deliveryTime: '55-65 min', deliveryFee: '$2.50', priceTier: 55, imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmJxfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60' },
  { id: '11', name: 'Veggie Delight', cuisineTypes: ['Vegetarian', 'Healthy'], rating: 4.8, reviewCount: 95, deliveryTimeMinutes: 30, deliveryTime: '25-35 min', deliveryFee: 'Free', priceTier: 32, imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnZXRhcmlhbiUyMGZvb2R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', dietaryOptions: ['vegetarian', 'vegan'] },
  { id: '12', name: 'Seafood Shack', cuisineTypes: ['Seafood'], rating: 4.3, reviewCount: 105, deliveryTimeMinutes: 40, deliveryTime: '35-45 min', deliveryFee: '$4.50', minimumOrderValue: 30, priceTier: 60, imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2VhZm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60' },
];


const DEFAULT_FILTERS: AppliedFilters = {
  cuisines: [],
  dietaryOptions: [],
  priceRange: [0, 200], // Matches FilterSidebar's default max price
  maxDeliveryTime: 120, // Matches FilterSidebar's default max delivery time
  sortBy: 'relevance',
};

const RestaurantListingPage: React.FC = () => {
  const [allRestaurants] = useState<Restaurant[]>(sampleRestaurants);
  const [displayedRestaurants, setDisplayedRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    console.log('RestaurantListingPage loaded');
    // Check for search query from Header navigation
    const queryParams = new URLSearchParams(location.search);
    const headerSearchTerm = queryParams.get('search');
    if (headerSearchTerm) {
      setSearchTerm(headerSearchTerm);
    }
    const cuisineFilter = queryParams.get('cuisine');
    if (cuisineFilter) {
        setAppliedFilters(prev => ({...prev, cuisines: [cuisineFilter]}));
    }

  }, [location.search]);

  const processedRestaurants = useMemo(() => {
    let filtered = [...allRestaurants];

    // Filter by search term (name)
    if (searchTerm.trim()) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by cuisines
    if (appliedFilters.cuisines.length > 0) {
      filtered = filtered.filter(restaurant =>
        appliedFilters.cuisines.some(cuisine => restaurant.cuisineTypes.map(c => c.toLowerCase()).includes(cuisine.toLowerCase()))
      );
    }
    
    // Filter by dietary options
    if (appliedFilters.dietaryOptions.length > 0) {
      filtered = filtered.filter(restaurant =>
        appliedFilters.dietaryOptions.every(opt => restaurant.dietaryOptions?.map(d => d.toLowerCase()).includes(opt.toLowerCase()))
      );
    }

    // Filter by price range (assuming priceTier is average meal cost)
    if (appliedFilters.priceRange) {
      filtered = filtered.filter(restaurant =>
        (restaurant.priceTier || 0) >= appliedFilters.priceRange[0] && (restaurant.priceTier || 0) <= appliedFilters.priceRange[1]
      );
    }
    
    // Filter by max delivery time
    if (appliedFilters.maxDeliveryTime) {
        filtered = filtered.filter(restaurant => restaurant.deliveryTimeMinutes <= appliedFilters.maxDeliveryTime);
    }

    // Sort
    switch (appliedFilters.sortBy) {
      case 'rating_desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'delivery_time_asc':
        filtered.sort((a, b) => a.deliveryTimeMinutes - b.deliveryTimeMinutes);
        break;
      case 'price_asc':
        filtered.sort((a, b) => (a.priceTier || Infinity) - (b.priceTier || Infinity));
        break;
      case 'price_desc':
        filtered.sort((a, b) => (b.priceTier || 0) - (a.priceTier || 0));
        break;
      case 'relevance': // Default sort, could be based on a mix or just original order for now
      default:
        // No specific sort or retain original filtered order
        break;
    }

    return filtered;
  }, [allRestaurants, searchTerm, appliedFilters]);

  const totalPages = Math.ceil(processedRestaurants.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const paginatedRestaurants = processedRestaurants.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
    setDisplayedRestaurants(paginatedRestaurants);
  }, [processedRestaurants, currentPage]);

  // Reset page to 1 when filters change
   useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, appliedFilters]);


  const handleApplyFilters = (filters: AppliedFilters) => {
    setAppliedFilters(filters);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0); // Scroll to top on page change
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header cartItemCount={3} userName="User" /> {/* Placeholder cart count and username */}

      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        <div className="lg:flex lg:gap-8">
          {/* Mobile Filter Trigger */}
          <div className="lg:hidden mb-4">
            <Button 
              onClick={() => setIsMobileFilterOpen(true)} 
              className="w-full flex items-center justify-center py-3 text-base"
              variant="outline"
            >
              <SlidersHorizontal className="mr-2 h-5 w-5" />
              Filters & Sort
            </Button>
          </div>

          {/* Filter Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:w-72 xl:w-80 sticky top-20 self-start max-h-[calc(100vh-10rem)] overflow-y-auto rounded-lg">
             {/* The FilterSidebar component itself handles scrolling if its content overflows its container */}
            <FilterSidebar onApplyFilters={handleApplyFilters} initialFilters={appliedFilters} />
          </aside>

          {/* Filter Sidebar (Mobile - Sheet) */}
          <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
            <SheetContent side="left" className="w-[300px] sm:w-[340px] p-0">
              <ScrollArea className="h-full"> {/* Ensures FilterSidebar content is scrollable if it exceeds sheet height */}
                <div className="p-0"> {/* FilterSidebar itself has padding */}
                  <FilterSidebar 
                    onApplyFilters={(filters) => { 
                      handleApplyFilters(filters); 
                      setIsMobileFilterOpen(false); 
                    }} 
                    initialFilters={appliedFilters} 
                  />
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Main Content: Search, Restaurant List, Pagination */}
          <div className="flex-1 lg:pl-8">
            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search restaurants by name..."
                  className="pl-10 w-full h-12 text-base"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  aria-label="Search restaurants by name"
                />
              </div>
            </div>
            
            {/* Restaurant Count */}
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {displayedRestaurants.length} of {processedRestaurants.length} restaurants
            </div>


            {/* Restaurant List */}
            {displayedRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedRestaurants.map(restaurant => (
                  <RestaurantCard
                    key={restaurant.id}
                    id={restaurant.id}
                    imageUrl={restaurant.imageUrl}
                    name={restaurant.name}
                    cuisineTypes={restaurant.cuisineTypes}
                    rating={restaurant.rating}
                    reviewCount={restaurant.reviewCount}
                    deliveryTime={restaurant.deliveryTime}
                    deliveryFee={restaurant.deliveryFee}
                    minimumOrderValue={restaurant.minimumOrderValue}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Restaurants Found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                        aria-disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      // Basic pagination display logic: show first, last, current, and 2 around current
                      const showPage = 
                        pageNum === 1 || 
                        pageNum === totalPages || 
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                      
                      const showEllipsisBefore = pageNum === currentPage - 2 && currentPage > 3 && totalPages > 5;
                      const showEllipsisAfter = pageNum === currentPage + 2 && currentPage < totalPages - 2 && totalPages > 5;


                      if (showEllipsisBefore && pageNum > 1) {
                         return <PaginationItem key={`ellipsis-start-${pageNum}`}><PaginationEllipsis /></PaginationItem>;
                      }
                      if (showPage) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => { e.preventDefault(); handlePageChange(pageNum); }}
                              isActive={currentPage === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      if (showEllipsisAfter && pageNum < totalPages) {
                        return <PaginationItem key={`ellipsis-end-${pageNum}`}><PaginationEllipsis /></PaginationItem>;
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                        aria-disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RestaurantListingPage;