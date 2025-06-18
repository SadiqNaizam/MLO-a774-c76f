import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Shadcn/ui Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge'; // For order status

// Lucide Icons
import { User, MapPin, CreditCard, History, Settings as SettingsIcon, Edit3, Trash2, PlusCircle, ShoppingBag } from 'lucide-react';

// Placeholder Data Interfaces
interface UserProfileData {
  name: string;
  email: string;
  phone: string;
}

interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  isDefault?: boolean;
}

interface PaymentMethod {
  id:string;
  type: 'Credit Card' | 'PayPal';
  details: string; // e.g., "Visa **** 1234" or "paypal@example.com"
  expiry?: string; // MM/YY for cards
  isDefault?: boolean;
}

interface Order {
  id: string;
  date: string;
  itemCount: number;
  total: number;
  status: 'Delivered' | 'Processing' | 'Cancelled' | 'Shipped';
  restaurantName: string;
}

interface AppSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  darkMode: boolean;
}

// Sample Data
const initialUserProfile: UserProfileData = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+1-555-0101',
};

const sampleAddresses: Address[] = [
  { id: 'addr1', type: 'Home', line1: '123 Willow Creek Rd', city: 'Springfield', postalCode: '62704', isDefault: true },
  { id: 'addr2', type: 'Work', line1: '456 Commerce St, Suite 700', city: 'Metropolis', postalCode: '60606' },
];

const samplePaymentMethods: PaymentMethod[] = [
  { id: 'pay1', type: 'Credit Card', details: 'Visa ending in 1234', expiry: '12/26', isDefault: true },
  { id: 'pay2', type: 'PayPal', details: 'alex.j@example.com' },
  { id: 'pay3', type: 'Credit Card', details: 'Mastercard ending in 5678', expiry: '08/25'},
];

const sampleOrders: Order[] = [
  { id: 'ORD001', date: '2024-07-15', itemCount: 3, total: 45.50, status: 'Delivered', restaurantName: 'The Gourmet Kitchen' },
  { id: 'ORD002', date: '2024-07-20', itemCount: 1, total: 12.75, status: 'Processing', restaurantName: 'Quick Bites Cafe' },
  { id: 'ORD003', date: '2024-06-10', itemCount: 5, total: 88.00, status: 'Shipped', restaurantName: 'Pasta Palace' },
  { id: 'ORD004', date: '2024-05-01', itemCount: 2, total: 25.00, status: 'Cancelled', restaurantName: 'Taco Truck Express' },
];

const initialAppSettings: AppSettings = {
  emailNotifications: true,
  pushNotifications: true,
  darkMode: false,
};


const UserProfilePage = () => {
  const [userProfile, setUserProfile] = useState<UserProfileData>(initialUserProfile);
  const [appSettings, setAppSettings] = useState<AppSettings>(initialAppSettings);
  // For Addresses and Payment Methods, we'll just display static list with placeholder buttons
  // A real app would have state for these lists and forms/dialogs for editing/adding.

  console.log('UserProfilePage loaded');

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Profile saved:', userProfile);
    // Here you would typically call an API to save the profile
    alert('Profile information saved!');
  };

  const handleSettingsChange = (key: keyof AppSettings, value: boolean) => {
    setAppSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSettingsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Settings saved:', appSettings);
    // API call to save settings
    alert('Settings saved!');
  };

  const getOrderStatusBadgeVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Delivered':
        return 'default'; // Default for success/delivered
      case 'Processing':
      case 'Shipped':
        return 'secondary'; // Secondary for in-progress states
      case 'Cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header cartItemCount={3} userName={userProfile.name} userImageUrl={`https://api.dicebear.com/7.x/lorelei/svg?seed=${userProfile.name.split(' ')[0]}`} />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground mb-8">Manage your profile, orders, and preferences.</p>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6 gap-2 h-auto flex-wrap md:h-10">
              <TabsTrigger value="profile" className="flex items-center gap-2"><User className="h-4 w-4"/> Profile</TabsTrigger>
              <TabsTrigger value="addresses" className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Addresses</TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2"><CreditCard className="h-4 w-4"/> Payment</TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2"><History className="h-4 w-4"/> Orders</TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2"><SettingsIcon className="h-4 w-4"/> Settings</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your name, email, and phone number.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={userProfile.name} onChange={handleProfileChange} placeholder="Your full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" value={userProfile.email} onChange={handleProfileChange} placeholder="your.email@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" value={userProfile.phone} onChange={handleProfileChange} placeholder="+1-XXX-XXX-XXXX" />
                    </div>
                    <Button type="submit">Save Changes</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Delivery Addresses</CardTitle>
                      <CardDescription>Manage your saved delivery locations.</CardDescription>
                    </div>
                    <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add New Address</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sampleAddresses.map(addr => (
                    <Card key={addr.id} className="p-4 border">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{addr.type} Address {addr.isDefault && <Badge variant="secondary" className="ml-2">Default</Badge>}</h3>
                          <p className="text-sm text-muted-foreground">{addr.line1}</p>
                          {addr.line2 && <p className="text-sm text-muted-foreground">{addr.line2}</p>}
                          <p className="text-sm text-muted-foreground">{addr.city}, {addr.postalCode}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" aria-label="Edit address"><Edit3 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" aria-label="Remove address" className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                   {sampleAddresses.length === 0 && <p className="text-muted-foreground text-center py-4">No addresses saved yet.</p>}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Methods Tab */}
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Payment Methods</CardTitle>
                      <CardDescription>Manage your saved payment options.</CardDescription>
                    </div>
                    <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add New Method</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {samplePaymentMethods.map(method => (
                    <Card key={method.id} className="p-4 border">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{method.type} {method.isDefault && <Badge variant="secondary" className="ml-2">Default</Badge>}</h3>
                          <p className="text-sm text-muted-foreground">{method.details}</p>
                          {method.expiry && <p className="text-sm text-muted-foreground">Expires: {method.expiry}</p>}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" aria-label="Edit payment method"><Edit3 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" aria-label="Remove payment method" className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {samplePaymentMethods.length === 0 && <p className="text-muted-foreground text-center py-4">No payment methods saved yet.</p>}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Order History Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View your past orders and their status.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>A list of your recent orders.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Restaurant</TableHead>
                        <TableHead className="text-center">Items</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{order.restaurantName}</TableCell>
                          <TableCell className="text-center">{order.itemCount}</TableCell>
                          <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={getOrderStatusBadgeVariant(order.status)}>{order.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/order-tracking?orderId=${order.id}`}>View Details</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {sampleOrders.length === 0 && <p className="text-muted-foreground text-center py-8">You haven't placed any orders yet.</p>}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Application Settings</CardTitle>
                  <CardDescription>Adjust your notification preferences and other app settings.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSettingsSubmit} className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Notification Preferences</h3>
                        <div className="flex items-center justify-between p-3 border rounded-md">
                            <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
                                <span>Email Notifications</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                Receive updates and promotions via email.
                                </span>
                            </Label>
                            <Switch
                                id="emailNotifications"
                                checked={appSettings.emailNotifications}
                                onCheckedChange={(checked) => handleSettingsChange('emailNotifications', checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-md">
                            <Label htmlFor="pushNotifications" className="flex flex-col space-y-1">
                                <span>Push Notifications</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                Get real-time alerts on your device.
                                </span>
                            </Label>
                            <Switch
                                id="pushNotifications"
                                checked={appSettings.pushNotifications}
                                onCheckedChange={(checked) => handleSettingsChange('pushNotifications', checked)}
                            />
                        </div>
                    </div>
                    <Separator />
                     <div className="space-y-4">
                        <h3 className="text-lg font-medium">Appearance</h3>
                        <div className="flex items-center justify-between p-3 border rounded-md">
                            <Label htmlFor="darkMode" className="flex flex-col space-y-1">
                                <span>Dark Mode</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                Enable dark theme for the application.
                                </span>
                            </Label>
                            <Switch
                                id="darkMode"
                                checked={appSettings.darkMode}
                                onCheckedChange={(checked) => handleSettingsChange('darkMode', checked)}
                                disabled // Placeholder: dark mode usually handled globally
                            />
                        </div>
                    </div>
                    <Button type="submit">Save Settings</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfilePage;