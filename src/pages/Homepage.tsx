import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Custom Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CuisineSelector from '@/components/CuisineSelector';
import RestaurantCard from '@/components/RestaurantCard';

// shadcn/ui Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

// Icons
import { Search, ExternalLink } from 'lucide-react';

// Sample Data
const sampleCuisines = [
  { id: 'italian', name: 'Italian', imageUrl: 'https://images.unsplash.com/photo-1533777857584-56861FC0b599?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' },
  { id: 'mexican', name: 'Mexican', imageUrl: 'https://images.unsplash.com/photo-1565299585323-BA4d69957954?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' },
  { id: 'chinese', name: 'Chinese', imageUrl: 'https://images.unsplash.com/photo-1585850600140-36c5a8adac82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' },
  { id: 'indian', name: 'Indian', imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' },
  { id: 'japanese', name: 'Japanese', imageUrl: 'https://images.unsplash.com/photo-1569718212165-781de6806f7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' },
  { id: 'american', name: 'American', imageUrl: 'https://images.unsplash.com/photo-1508091269701-59ac937800f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' },
  { id: 'thai', name: 'Thai', imageUrl: 'https://images.unsplash.com/photo-1569560996725-e0ba7f676349?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' },
];

const featuredRestaurants = [
  { id: 'r1', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', name: 'Bella Napoli Pizzeria', cuisineTypes: ['Italian', 'Pizza'], rating: 4.7, reviewCount: 250, deliveryTime: '25-35 min', deliveryFee: '$1.99', minimumOrderValue: 10 },
  { id: 'r2', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', name: 'Taco Fiesta Express', cuisineTypes: ['Mexican', 'Tacos'], rating: 4.5, reviewCount: 180, deliveryTime: '20-30 min', deliveryFee: 'Free', minimumOrderValue: 12 },
  { id: 'r3', imageUrl: 'https://images.unsplash.com/photo-1582650859019-9b396800a303?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', name: 'Sushi World', cuisineTypes: ['Japanese', 'Sushi'], rating: 4.8, reviewCount: 300, deliveryTime: '30-45 min', deliveryFee: '$3.50', minimumOrderValue: 20 },
  { id: 'r4', imageUrl: 'https://images.unsplash.com/photo-1541592106381-b58e0633f7e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', name: 'Burger Bliss', cuisineTypes: ['American', 'Burgers'], rating: 4.3, reviewCount: 120, deliveryTime: '20-25 min', deliveryFee: '$2.00' },
];

const popularRestaurants = [
  { id: 'r5', imageUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', name: 'Mama Mia Pasta Bar', cuisineTypes: ['Italian', 'Pasta'], rating: 4.6, reviewCount: 190, deliveryTime: '35-45 min', deliveryFee: '$2.50', minimumOrderValue: 18 },
  { id: 'r6', imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', name: 'The Curry House', cuisineTypes: ['Indian', 'Curry'], rating: 4.9, reviewCount: 450, deliveryTime: '30-40 min', deliveryFee: 'Free', minimumOrderValue: 15 },
  { id: 'r7', imageUrl: 'https://images.unsplash.com/photo-1600335895983-1eeb0575e5e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', name: 'Peking Dragon', cuisineTypes: ['Chinese'], rating: 4.4, reviewCount: 220, deliveryTime: '25-35 min', deliveryFee: '$1.00' },
  { id: 'r8', imageUrl: 'https://images.unsplash.com/photo-1568000543478-5a50eda8d8a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', name: 'Green Leaf Salads', cuisineTypes: ['Healthy', 'Salads'], rating: 4.7, reviewCount: 150, deliveryTime: '15-25 min', deliveryFee: '$3.00', minimumOrderValue: 10 },
];

const samplePromotions = [
  { id: 'promo1', title: 'Lunch Special: 15% Off!', description: 'Get 15% off on all lunch orders between 12 PM - 3 PM. No code needed.', imageUrl: 'https://images.unsplash.com/photo-1550304940-5c2b9aa41449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', buttonText: 'Explore Lunch Deals', link: '/restaurant-listing?promo=lunch15' },
  { id: 'promo2', title: 'Free Delivery Weekend', description: 'Enjoy free delivery on all orders above $20 this weekend!', imageUrl: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', buttonText: 'Order Now', link: '/restaurant-listing?promo=freedelivery' },
  { id: 'promo3', title: 'Sweet Treats Discount', description: 'Craving something sweet? Get $5 off on all dessert orders over $15.', imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', buttonText: 'Find Desserts', link: '/restaurant-listing?category=desserts' },
];


const Homepage = () => {
  const [heroSearchTerm, setHeroSearchTerm] = useState('');
  const navigate = useNavigate();

  console.log('Homepage loaded');

  const handleHeroSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (heroSearchTerm.trim()) {
      navigate(`/restaurant-listing?search=${encodeURIComponent(heroSearchTerm.trim())}`);
      setHeroSearchTerm('');
    }
  };

  const handleCuisineSelect = (cuisineId: string) => {
    navigate(`/restaurant-listing?cuisine=${cuisineId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header cartItemCount={2} userName="User" userImageUrl="https://source.unsplash.com/random/40x40/?profile" />
      
      <main className="flex-1">
        {/* Hero Section with Prominent Search */}
        <section 
          className="relative py-16 md:py-24 lg:py-32 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')" }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="container relative px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
              Your Favorite Food, Delivered Fast
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Discover top restaurants and cuisines near you. Quick, easy, and delicious.
            </p>
            <form onSubmit={handleHeroSearchSubmit} className="max-w-xl mx-auto flex items-center gap-2 bg-white p-2 rounded-lg shadow-xl">
              <Search className="ml-3 h-5 w-5 text-muted-foreground flex-shrink-0" />
              <Input
                type="search"
                placeholder="Search for restaurants or dishes..."
                className="h-12 text-md md:text-lg flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                value={heroSearchTerm}
                onChange={(e) => setHeroSearchTerm(e.target.value)}
                aria-label="Search for restaurants or dishes"
              />
              <Button type="submit" size="lg" className="h-12 px-6 text-md">
                Find Food
              </Button>
            </form>
          </div>
        </section>

        {/* Cuisine Selector Section */}
        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <CuisineSelector 
              cuisines={sampleCuisines} 
              onSelectCuisine={handleCuisineSelect} 
              title="Explore by Cuisine" 
            />
          </div>
        </section>

        {/* Featured Restaurants Section */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <h2 className="text-3xl font-bold tracking-tight">Featured Restaurants</h2>
              <Link to="/restaurant-listing?filter=featured">
                <Button variant="outline" className="w-full sm:w-auto">View All Featured</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
              {featuredRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} {...restaurant} />
              ))}
            </div>
          </div>
        </section>

        {/* Popular Near You Section */}
        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <h2 className="text-3xl font-bold tracking-tight">Popular Near You</h2>
              <Link to="/restaurant-listing?filter=popular">
                <Button variant="outline" className="w-full sm:w-auto">View All Popular</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
              {popularRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} {...restaurant} />
              ))}
            </div>
          </div>
        </section>

        {/* Promotions Section */}
        <section className="py-12 md:py-16 bg-primary/5">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-10">Today's Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {samplePromotions.map(promo => (
                <Card key={promo.id} className="overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-shadow">
                  <div className="aspect-video">
                     <img src={promo.imageUrl} alt={promo.title} className="object-cover w-full h-full" />
                  </div>
                  <CardHeader>
                    <CardTitle>{promo.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>{promo.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Link to={promo.link} className="w-full">
                      <Button className="w-full">
                        {promo.buttonText} <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Homepage;