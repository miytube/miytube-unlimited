
import React from 'react';
import { Plane, Car, Truck, Bike, Train, Ship, Anchor } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const AviationTransportLinks: React.FC = () => {
  const aviationTransportLinks = [
    { 
      id: 'airplanes', 
      icon: Plane, 
      label: 'Airplanes', 
      path: '/airplanes',
      subItems: [
        { id: 'airplanes-airships', label: 'Airships & Blimps', path: '/airplanes/airships' },
        { id: 'airplanes-cargo', label: 'Cargo Planes', path: '/airplanes/cargo' },
        { id: 'airplanes-commercial', label: 'Commercial & Jumbo Jets', path: '/airplanes/commercial' },
        { id: 'airplanes-land-water', label: 'Land & Water Planes', path: '/airplanes/land-water' },
        { id: 'airplanes-pilots', label: 'Pilots & Captains', path: '/airplanes/pilots' },
        { id: 'airplanes-single-engine', label: 'Single Engine & Small', path: '/airplanes/single-engine' },
        { id: 'airplanes-fleet', label: 'Airplane Fleet & Aircrafts', path: '/airplanes/fleet' }
      ]
    },
    { 
      id: 'airports', 
      icon: Plane, 
      label: 'Airports', 
      path: '/airports',
      subItems: [
        { id: 'airports-passenger', label: 'Passenger', path: '/airports/passenger' },
        { id: 'airports-bag-checks', label: 'Bag Checks', path: '/airports/bag-checks' },
        { id: 'airports-flights', label: 'Flights', path: '/airports/flights' },
        { id: 'airports-check-in-lines', label: 'Check In Lines', path: '/airports/check-in-lines' }
      ]
    },
    { 
      id: 'helicopters', 
      icon: Plane, 
      label: 'Helicopters', 
      path: '/helicopters',
      subItems: [
        { id: 'helicopters-passenger', label: 'Passenger & Commercial', path: '/helicopters/passenger' },
        { id: 'helicopters-private', label: 'Private Helicopters', path: '/helicopters/private' }
      ]
    },
    { 
      id: 'cars', 
      icon: Car, 
      label: 'Cars & Vehicles', 
      path: '/autos-vehicles',
      subItems: [
        { id: 'cars-major-repairs', label: 'Major Repairs', path: '/cars/major-repairs' },
        { id: 'cars-minor-repairs', label: 'Minor Repairs', path: '/cars/minor-repairs' },
        { id: 'cars-racing-crashes', label: 'Racing Crashes & Accidents', path: '/cars/racing-crashes' },
        { id: 'cars-hacks', label: 'Car Hacks & Tips', path: '/cars/hacks' },
        { id: 'cars-repo', label: 'Car Repo & Repossession', path: '/cars/repo' },
        { id: 'cars-drifting', label: 'Drifting & Drivers', path: '/cars/drifting' },
        { id: 'cars-expensive', label: 'Expensive & Rarest Cars', path: '/cars/expensive' },
        { id: 'cars-future', label: 'Future Vehicles', path: '/cars/future' },
        { id: 'cars-sedans', label: 'Sedans & Coupes', path: '/cars/sedans' },
        { id: 'cars-strange', label: 'Strange & Weird Cars', path: '/cars/strange' },
        { id: 'cars-supercars', label: 'Supercars & Hypercars', path: '/cars/supercars' },
        { id: 'cars-accidents', label: 'Car Accidents & Idiots', path: '/cars/accidents' },
        { id: 'cars-crashes', label: 'Crashes', path: '/cars/crashes' }
      ]
    },
    { 
      id: 'motorcycles', 
      icon: Bike, 
      label: 'Motorcycles', 
      path: '/motorcycles',
      subItems: [
        { id: 'motorcycles-harley', label: 'Harley Davidson', path: '/motorcycles/harley' },
        { id: 'motorcycles-offroad', label: 'Off Road Bikes', path: '/motorcycles/offroad' },
        { id: 'motorcycles-sports', label: 'Sports Bikes', path: '/motorcycles/sports' },
        { id: 'motorcycles-street', label: 'Street Bikes', path: '/motorcycles/street' },
        { id: 'motorcycles-fails', label: 'Tricks & Fails', path: '/motorcycles/fails' }
      ]
    },
    { 
      id: 'trucks', 
      icon: Truck, 
      label: 'Trucks', 
      path: '/trucks',
      subItems: [
        { id: 'trucks-pickups', label: 'Pickups & Vans', path: '/trucks/pickups' },
        { id: 'trucks-semi', label: 'Semi Trucks', path: '/trucks/semi' },
        { id: 'trucks-heavy', label: 'Heavy Equipment', path: '/trucks/heavy' }
      ]
    },
    { 
      id: 'trains', 
      icon: Train, 
      label: 'Trains', 
      path: '/trains',
      subItems: [
        { id: 'trains-commercial', label: 'Commercial Trains', path: '/trains/commercial' },
        { id: 'trains-passenger', label: 'Passenger Trains', path: '/trains/passenger' },
        { id: 'trains-crashes', label: 'Train Crashes & Accidents', path: '/trains/crashes' },
        { id: 'trains-hobos', label: 'Train Riders & Hobos', path: '/trains/riders' }
      ]
    },
    { 
      id: 'drones', 
      icon: Plane, 
      label: 'Drones', 
      path: '/drones',
      subItems: [
        { id: 'drones-civilian', label: 'Civilian & Recreational', path: '/drones/civilian' },
        { id: 'drones-commercial', label: 'Commercial Drones', path: '/drones/commercial' }
      ]
    },
    { 
      id: 'boats', 
      icon: Ship, 
      label: 'Boats & Ships', 
      path: '/boats',
      subItems: [
        { id: 'boats-icebreakers', label: 'Ship Icebreakers', path: '/boats/icebreakers' },
        { id: 'boats-cruise', label: 'Cruise Ships', path: '/boats/cruise' },
        { id: 'boats-submarines', label: 'Civilian Submarines', path: '/boats/submarines' },
        { id: 'boats-tugboats', label: 'Tugboats', path: '/boats/tugboats' },
        { id: 'boats-yachts', label: 'Yachts & Luxury Yachts', path: '/boats/yachts' },
        { id: 'boats-sailing', label: 'Sailing Ships', path: '/boats/sailing' },
        { id: 'boats-container', label: 'Container Ships & Oil Tankers', path: '/boats/container' },
        { id: 'boats-jetski', label: 'Jet Skis & Personal Watercraft', path: '/boats/jetski' }
      ]
    },
    { 
      id: 'shipping-ports', 
      icon: Anchor, 
      label: 'Shipping Ports', 
      path: '/shipping-ports',
      subItems: [
        { id: 'ports-cargo', label: 'Cargo Ports', path: '/shipping-ports/cargo' },
        { id: 'ports-cruise', label: 'Cruise Terminals', path: '/shipping-ports/cruise' },
        { id: 'ports-history', label: 'Historic Ports', path: '/shipping-ports/history' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="AVIATION & TRANSPORT" links={aviationTransportLinks} />;
};
