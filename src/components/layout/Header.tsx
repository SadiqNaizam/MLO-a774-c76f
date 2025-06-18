import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Package, Search, ShoppingCart, User, Menu, HomeIcon, Utensils, ListOrdered } from 'lucide-react';

interface HeaderProps {
  cartItemCount?: number;
  userName?: string; // Optional: for user avatar initials
  userImageUrl?: string; // Optional: for user avatar image
}

const Header: React.FC<HeaderProps> = ({ cartItemCount = 0, userName, userImageUrl }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  console.log('Header loaded');

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Assuming search navigates to restaurant listing with a query parameter
      navigate(`/restaurant-listing?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      if (isSheetOpen) setIsSheetOpen(false); // Close sheet on search
    }
  };

  const navLinks = [
    { href: "/", label: "Home", icon: <HomeIcon className="mr-2 h-5 w-5" /> },
    { href: "/restaurant-listing", label: "Restaurants", icon: <Utensils className="mr-2 h-5 w-5" /> },
    { href: "/order-tracking", label: "My Orders", icon: <ListOrdered className="mr-2 h-5 w-5" /> },
  ];

  const NavLinkItem: React.FC<{ href: string; label: string; icon: React.ReactNode; onClick?: () => void }> = ({ href, label, icon, onClick }) => (
    <Button variant="ghost" asChild className="justify-start w-full text-left md:w-auto md:justify-center hover:bg-muted/50 hover:text-primary transition-colors" onClick={onClick}>
      <Link to={href} className="flex items-center">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </Link>
    </Button>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and Brand Name */}
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <Package className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline-block">FoodApp</span>
        </Link>

        {/* Desktop Navigation & Search */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map(link => <NavLinkItem key={link.href} {...link} />)}
          <form onSubmit={handleSearchSubmit} className="relative ml-4">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search restaurants..."
              className="pl-8 w-[200px] lg:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </nav>

        {/* Right Icons - Cart, User, Mobile Menu Trigger */}
        <div className="flex items-center gap-3 md:gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/cart" aria-label="View Cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>

          <Link to="/user-profile" aria-label="User Profile">
            <Avatar className="h-8 w-8">
              {userImageUrl && <AvatarImage src={userImageUrl} alt={userName || 'User'} />}
              <AvatarFallback>
                {userName ? userName.substring(0, 2).toUpperCase() : <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
          </Link>

          {/* Mobile Menu Trigger */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[340px]">
              <SheetHeader className="mb-4">
                <SheetTitle>
                  <Link to="/" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setIsSheetOpen(false)}>
                    <Package className="h-6 w-6 text-primary" />
                    <span>FoodApp</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                <form onSubmit={handleSearchSubmit} className="relative mb-4">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search restaurants..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>
                {navLinks.map(link => <NavLinkItem key={link.href} {...link} onClick={() => setIsSheetOpen(false)}/>)}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;