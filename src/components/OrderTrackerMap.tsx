import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Store, Home, Clock, Truck } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  name?: string;
  address?: string;
}

interface OrderTrackerMapProps {
  agentLocation?: Location;
  restaurantLocation: Location;
  userLocation: Location;
  estimatedTimeOfArrival: string;
  orderStatus: string;
}

const OrderTrackerMap: React.FC<OrderTrackerMapProps> = ({
  agentLocation = { lat: 34.0522, lng: -118.2437, name: "Delivery Rider" }, // Placeholder default
  restaurantLocation,
  userLocation,
  estimatedTimeOfArrival,
  orderStatus,
}) => {
  console.log('OrderTrackerMap loaded');

  // Simplified fixed positions for icons on the placeholder map
  const agentDisplayPos = { top: '50%', left: '50%' }; 
  const restaurantDisplayPos = { top: '20%', left: '25%' };
  const userDisplayPos = { top: '75%', left: '75%' };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-semibold">
          <Truck className="mr-3 h-7 w-7 text-primary" />
          Live Order Tracking
        </CardTitle>
        <CardDescription>
          Follow your order in real-time. Your meal is on its way!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Placeholder Map Area */}
        <div className="relative h-72 w-full bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
          {/* 
            This is a placeholder for an actual map.
            In a real application, you would integrate a map library here 
            (e.g., Mapbox GL JS, Google Maps API, Leaflet)
            and use the provided location props to display dynamic markers and paths.
          */}
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <p className="text-slate-500 dark:text-slate-400 text-center p-4 bg-white/70 dark:bg-black/50 rounded-md shadow">
              Interactive Map Placeholder
              <br />
              (Actual map integration required)
            </p>
          </div>

          {/* Placeholder for Restaurant Icon */}
          <div
            className="absolute p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-md z-10"
            style={{ top: restaurantDisplayPos.top, left: restaurantDisplayPos.left, transform: 'translate(-50%, -50%)' }}
            title={`Restaurant: ${restaurantLocation.name || 'Origin'}`}
          >
            <Store className="h-6 w-6 text-red-500" />
          </div>

          {/* Placeholder for Agent Icon */}
          {agentLocation && (
            <div
              className="absolute p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-md z-10 animate-pulse"
              style={{ top: agentDisplayPos.top, left: agentDisplayPos.left, transform: 'translate(-50%, -50%)' }}
              title={`Delivery Agent: ${agentLocation.name || 'Current Location'}`}
            >
              <MapPin className="h-7 w-7 text-blue-500" />
            </div>
          )}

          {/* Placeholder for User Icon */}
          <div
            className="absolute p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-md z-10"
            style={{ top: userDisplayPos.top, left: userDisplayPos.left, transform: 'translate(-50%, -50%)' }}
            title={`Your Location: ${userLocation.name || 'Destination'}`}
          >
            <Home className="h-6 w-6 text-green-500" />
          </div>
          
          {/* Visual cue for path (very simplified) */}
           <svg className="absolute inset-0 w-full h-full z-0" style={{pointerEvents: 'none'}}>
            {/* Line from Restaurant to Agent (if agent exists) */}
            {agentLocation && (
              <line 
                x1={restaurantDisplayPos.left} y1={restaurantDisplayPos.top} 
                x2={agentDisplayPos.left} y2={agentDisplayPos.top} 
                strokeDasharray="5, 5" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2"
              />
            )}
            {/* Line from Agent to User (if agent exists) */}
            {agentLocation && (
              <line 
                x1={agentDisplayPos.left} y1={agentDisplayPos.top} 
                x2={userDisplayPos.left} y2={userDisplayPos.top} 
                strokeDasharray="5, 5" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2"
              />
            )}
          </svg>
        </div>

        {/* Delivery Information */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Order Status</p>
              <p className="text-lg font-semibold text-primary">{orderStatus}</p>
            </div>
            <Truck className="h-8 w-8 text-slate-400 dark:text-slate-500" />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Estimated Arrival</p>
              <p className="text-lg font-semibold text-primary">{estimatedTimeOfArrival}</p>
            </div>
            <Clock className="h-8 w-8 text-slate-400 dark:text-slate-500" />
          </div>

          <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1 pt-2">
            <p><strong>From:</strong> {restaurantLocation.name || restaurantLocation.address || "Restaurant (Details not provided)"}</p>
            <p><strong>To:</strong> {userLocation.name || userLocation.address || "Your Location (Details not provided)"}</p>
            {agentLocation?.name && <p><strong>Rider:</strong> {agentLocation.name}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTrackerMap;