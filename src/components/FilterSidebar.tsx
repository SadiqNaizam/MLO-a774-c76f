import React, { useState, useEffect } from 'react';
import { Sidebar } from "@/components/ui/sidebar"; // Assuming this is a container component
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FilterX, Check } from 'lucide-react';

// Define interfaces for props and filter state
export interface AppliedFilters {
  cuisines: string[];
  dietaryOptions: string[];
  priceRange: [number, number];
  maxDeliveryTime: number;
  sortBy: string;
}

interface FilterSidebarProps {
  initialFilters?: Partial<AppliedFilters>;
  onApplyFilters: (filters: AppliedFilters) => void;
  // onClearFilters prop is not strictly needed if clear button just resets internal state and applies empty filters
}

// Sample data for filter options
const CuisinesData = [
  { id: 'italian', name: 'Italian' },
  { id: 'chinese', name: 'Chinese' },
  { id: 'mexican', name: 'Mexican' },
  { id: 'indian', name: 'Indian' },
  { id: 'japanese', name: 'Japanese' },
  { id: 'thai', name: 'Thai' },
  { id: 'american', name: 'American' },
];

const DietaryOptionsData = [
  { id: 'vegetarian', name: 'Vegetarian' },
  { id: 'vegan', name: 'Vegan' },
  { id: 'gluten-free', name: 'Gluten-Free' },
  { id: 'halal', name: 'Halal' },
  { id: 'kosher', name: 'Kosher' },
];

const SortOptionsData = [
  { id: 'relevance', name: 'Relevance' },
  { id: 'rating_desc', name: 'Rating (High to Low)' },
  { id: 'delivery_time_asc', name: 'Delivery Time (Fastest)' },
  { id: 'price_asc', name: 'Price (Low to High)' },
  { id: 'price_desc', name: 'Price (High to Low)' },
];

const DEFAULT_PRICE_RANGE: [number, number] = [0, 100];
const DEFAULT_MAX_DELIVERY_TIME: number = 60; // minutes
const DEFAULT_SORT_BY: string = 'relevance';

const FilterSidebar: React.FC<FilterSidebarProps> = ({ initialFilters, onApplyFilters }) => {
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(initialFilters?.cuisines || []);
  const [selectedDietaryOptions, setSelectedDietaryOptions] = useState<string[]>(initialFilters?.dietaryOptions || []);
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters?.priceRange || DEFAULT_PRICE_RANGE);
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number>(initialFilters?.maxDeliveryTime || DEFAULT_MAX_DELIVERY_TIME);
  const [sortBy, setSortBy] = useState<string>(initialFilters?.sortBy || DEFAULT_SORT_BY);

  useEffect(() => {
    console.log('FilterSidebar loaded');
    // If initialFilters are provided, set them
    if (initialFilters) {
        setSelectedCuisines(initialFilters.cuisines || []);
        setSelectedDietaryOptions(initialFilters.dietaryOptions || []);
        setPriceRange(initialFilters.priceRange || DEFAULT_PRICE_RANGE);
        setMaxDeliveryTime(initialFilters.maxDeliveryTime || DEFAULT_MAX_DELIVERY_TIME);
        setSortBy(initialFilters.sortBy || DEFAULT_SORT_BY);
    }
  }, [initialFilters]);


  const handleCheckboxChange = (
    id: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    currentValues: string[]
  ) => {
    setter(
      currentValues.includes(id)
        ? currentValues.filter(val => val !== id)
        : [...currentValues, id]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      cuisines: selectedCuisines,
      dietaryOptions: selectedDietaryOptions,
      priceRange,
      maxDeliveryTime,
      sortBy,
    });
  };

  const handleClearAll = () => {
    setSelectedCuisines([]);
    setSelectedDietaryOptions([]);
    setPriceRange(DEFAULT_PRICE_RANGE);
    setMaxDeliveryTime(DEFAULT_MAX_DELIVERY_TIME);
    setSortBy(DEFAULT_SORT_BY);
    // Also apply these cleared filters
    onApplyFilters({
      cuisines: [],
      dietaryOptions: [],
      priceRange: DEFAULT_PRICE_RANGE,
      maxDeliveryTime: DEFAULT_MAX_DELIVERY_TIME,
      sortBy: DEFAULT_SORT_BY,
    });
  };

  return (
    <Sidebar className="w-full md:w-72 lg:w-80 p-4 border-r bg-card text-card-foreground space-y-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Filters</h2>
      </div>
      <Separator />

      {/* Cuisine Section */}
      <div>
        <h3 className="text-md font-medium mb-3">Cuisine</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {CuisinesData.map(cuisine => (
            <div key={cuisine.id} className="flex items-center space-x-2">
              <Checkbox
                id={`cuisine-${cuisine.id}`}
                checked={selectedCuisines.includes(cuisine.id)}
                onCheckedChange={() => handleCheckboxChange(cuisine.id, setSelectedCuisines, selectedCuisines)}
              />
              <Label htmlFor={`cuisine-${cuisine.id}`} className="font-normal text-sm cursor-pointer">{cuisine.name}</Label>
            </div>
          ))}
        </div>
      </div>
      <Separator />

      {/* Dietary Options Section */}
      <div>
        <h3 className="text-md font-medium mb-3">Dietary Options</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {DietaryOptionsData.map(option => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`dietary-${option.id}`}
                checked={selectedDietaryOptions.includes(option.id)}
                onCheckedChange={() => handleCheckboxChange(option.id, setSelectedDietaryOptions, selectedDietaryOptions)}
              />
              <Label htmlFor={`dietary-${option.id}`} className="font-normal text-sm cursor-pointer">{option.name}</Label>
            </div>
          ))}
        </div>
      </div>
      <Separator />

      {/* Price Range Section */}
      <div>
        <h3 className="text-md font-medium mb-3">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          min={0}
          max={200} // Max price, e.g., $200
          step={5}
          className="my-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
      <Separator />

      {/* Delivery Time Section */}
      <div>
        <h3 className="text-md font-medium mb-3">Max Delivery Time</h3>
        <Slider
          value={[maxDeliveryTime]}
          onValueChange={(value) => setMaxDeliveryTime(value[0])}
          min={15} // Min delivery time, e.g., 15 mins
          max={120} // Max delivery time, e.g., 120 mins
          step={5}
          className="my-4"
        />
        <div className="text-sm text-muted-foreground text-center">
          Up to {maxDeliveryTime} minutes
        </div>
      </div>
      <Separator />

      {/* Sort By Section */}
      <div>
        <h3 className="text-md font-medium mb-3">Sort By</h3>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select sorting" />
          </SelectTrigger>
          <SelectContent>
            {SortOptionsData.map(option => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Separator />

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <Button onClick={handleApply} className="w-full">
          <Check className="mr-2 h-4 w-4" /> Apply Filters
        </Button>
        <Button variant="outline" onClick={handleClearAll} className="w-full">
          <FilterX className="mr-2 h-4 w-4" /> Clear All Filters
        </Button>
      </div>
    </Sidebar>
  );
};

export default FilterSidebar;