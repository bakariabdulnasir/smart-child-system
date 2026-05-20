import React, { useState, useEffect } from 'react';
import {
  Bell,
  LogOut,
  MapPin,
  Search,
  School,
  Hospital,
  TreePine,
  ShoppingCart,
  Library,
  Navigation,
  Loader,
  ExternalLink,
  Phone,
  Clock,
  User,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Amenities = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Location state - default to Nairobi, Kenya
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  
  // Amenity type selection
  const [amenityType, setAmenityType] = useState('school');

  // Kenyan-focused amenities
  const amenityOptions = [
    { value: 'school', label: 'Schools', icon: <School size={20} />, description: 'Schools & Universities' },
    { value: 'hospital', label: 'Hospitals', icon: <Hospital size={20} />, description: 'Hospitals & Clinics' },
    { value: 'park', label: 'Parks', icon: <TreePine size={20} />, description: 'Parks & Gardens' },
    { value: 'supermarket', label: 'Malls', icon: <ShoppingCart size={20} />, description: 'Shopping Malls' },
    { value: 'library', label: 'Libraries', icon: <Library size={20} />, description: 'Public Libraries' },
    { value: 'pharmacy', label: 'Pharmacies', icon: <Hospital size={20} />, description: 'Pharmacies' },
    { value: 'playground', label: 'Playgrounds', icon: <TreePine size={20} />, description: 'Kids Play Areas' },
  ];

  // Kenyan popular locations for manual search
  const kenyanLocations = [
    { name: 'Nairobi', lat: -1.2921, lng: 36.8219 },
    { name: 'Mombasa', lat: -4.0435, lng: 39.6682 },
    { name: 'Kisumu', lat: -0.1022, lng: 34.7616 },
    { name: 'Nakuru', lat: -0.3031, lng: 36.0800 },
    { name: 'Eldoret', lat: 0.5143, lng: 35.2698 },
    { name: 'Thika', lat: -1.0334, lng: 37.0692 },
    { name: 'Malindi', lat: -3.2138, lng: 40.1169 },
    { name: 'Kitale', lat: 1.0157, lng: 35.0062 },
  ];

  useEffect(() => {
    // Try to get user's location on mount
    getUserLocation();
  }, []);

  useEffect(() => {
    // Auto-search when location is obtained
    if (location.lat && location.lng && !locationLoading) {
      searchNearbyPlaces();
    }
  }, [location, locationLoading]);

const getUserLocation = () => {
    setLocationLoading(true);
    setLocationError('');
    
    if (!navigator.geolocation) {
      // Fallback to Nairobi, Kenya if geolocation not supported
      setLocation({ lat: -1.2921, lng: 36.8219 });
      setLocationLoading(false);
      setLocationError('Using Nairobi (default). Enable location for accurate results.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationLoading(false);
      },
      (err) => {
        // Fallback to Nairobi, Kenya on error
        setLocationError('Using Nairobi (default). Enable location or choose a city below.');
        setLocation({ lat: -1.2921, lng: 36.8219 });
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle manual location selection
  const handleLocationSelect = (e) => {
    const selectedCity = e.target.value;
    if (selectedCity === 'current') {
      getUserLocation();
    } else {
      const city = kenyanLocations.find(c => c.name === selectedCity);
      if (city) {
        setLocation({ lat: city.lat, lng: city.lng });
        setManualLocation(selectedCity);
        setLocationError('');
      }
    }
  };

  const searchNearbyPlaces = async () => {
    if (!location.lat || !location.lng) {
      setError('Please provide a location first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setPlaces([]);

    try {
      const response = await apiFetch(
        `/locations/nearby?lat=${location.lat}&lng=${location.lng}&amenity=${amenityType}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Sort by distance if available
          const sortedPlaces = [...data.data].sort((a, b) => {
            if (a.distance && b.distance) return a.distance - b.distance;
            return 0;
          });
          setPlaces(sortedPlaces);
          setSuccess(`Found ${sortedPlaces.length} ${amenityOptions.find(o => o.value === amenityType)?.label} nearby`);
        } else {
          setPlaces([]);
          setError('No places found. Try a different category or location.');
        }
      } else {
        const err = await response.json();
        setError(err.message || 'Failed to search places');
      }
    } catch (err) {
      setError('Network error - is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const getAmenityIcon = (type) => {
    const option = amenityOptions.find(o => o.value === type);
    return option ? option.icon : <MapPin size={20} />;
  };

  const formatDistance = (distance) => {
    if (distance) {
      return distance.toFixed(1);
    }
    return '-';
  };

  // Generate Google Maps directions link
  const getDirectionsLink = (place) => {
    const lat = place.lat || location.lat;
    const lng = place.lng || location.lng;
    const destination = place.address || place.name;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  };

  // Format address for display
  const formatAddress = (place) => {
    if (place.address) return place.address;
    if (place.lat && place.lng) return `${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}`;
    return 'Address not available';
  };

  // Get current amenity info
  const currentAmenity = amenityOptions.find(o => o.value === amenityType);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Message Toast */}
      {error && (
        <div className="fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg bg-red-500 text-white flex items-center gap-2">
          <Bell size={18} />
          {error}
        </div>
      )}
      {success && (
        <div className="fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg bg-green-500 text-white">
          {success}
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <h1 className="text-2xl font-bold text-indigo-600">Smart Child</h1>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-indigo-600">Dashboard</button>
              <button onClick={() => navigate('/schedule')} className="text-gray-500 hover:text-indigo-600">Schedule</button>
              <button onClick={() => navigate('/tasks')} className="text-gray-500 hover:text-indigo-600">Tasks</button>
              <button onClick={() => navigate('/family')} className="text-gray-500 hover:text-indigo-600">Family</button>
              <button className="text-indigo-600">Amenities</button>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Bell className="text-gray-500" size={20} />
            <div className="flex items-center gap-2">
              {user?.profile_image ? (
                <img src={user.profile_image} alt="profile" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : '?'}
                </div>
              )}
              <span className="font-medium">{user?.full_name || "User"}</span>
            </div>
            <button onClick={logout} className="flex items-center gap-2 text-red-500">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Nearby Amenities</h1>
          <p className="text-gray-500 mt-1">Find schools, hospitals, parks, and more in your area</p>
        </div>

        {/* Location Info Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Navigation className="text-indigo-600" />
            Your Location
          </h2>
          
{locationLoading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader className="animate-spin" size={20} />
              Detecting your location...
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="text-gray-600">
                  {location.lat && location.lng ? (
                    <>
                      <span className="font-medium">Searching near:</span>{' '}
                      {manualLocation || location.lat.toFixed(2) + ', ' + location.lng.toFixed(2)}
                    </>
                  ) : (
                    <span>Location not set. Click "Get My Location" below.</span>
                  )}
                </div>
                <button
                  onClick={getUserLocation}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                >
                  <Navigation size={16} />
                  Get My Location
                </button>
              </div>
              
              {/* Kenyan Cities Quick Select */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500">Quick select:</span>
                <select
                  onChange={handleLocationSelect}
                  className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-sm text-gray-700 border-0 cursor-pointer"
                  value={manualLocation || ''}
                >
                  <option value="">Choose a city...</option>
                  <option value="current">📍 Use My Current Location</option>
                  {kenyanLocations.map(city => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {locationError && (
            <p className="text-orange-500 text-sm mt-2">{locationError}</p>
          )}
        </div>

        {/* Category Selection */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Search className="text-indigo-600" />
            Browse by Category
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {amenityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setAmenityType(option.value);
                  setPlaces([]);
                }}
                className={`p-4 rounded-xl flex flex-col items-center gap-2 transition ${
                  amenityType === option.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className={amenityType === option.value ? 'text-white' : 'text-indigo-600'}>
                  {option.icon}
                </div>
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 p-4 bg-indigo-50 rounded-xl">
            <div className="flex items-center gap-2 text-indigo-700">
              <User size={18} />
              <span className="font-medium">Showing:</span>
              <span>{currentAmenity?.label || 'Select a category'}</span>
              <span className="text-indigo-500">•</span>
              <span className="text-sm text-indigo-600">{currentAmenity?.description}</span>
            </div>
          </div>
        </div>

        {/* Results Section - List View instead of Map */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MapPin className="text-indigo-600" />
              {places.length > 0 ? `${places.length} ${currentAmenity?.label} Found` : `Search ${currentAmenity?.label}`}
            </h2>
            <button
              onClick={searchNearbyPlaces}
              disabled={loading || !location.lat || !location.lng}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Search Now
                </>
              )}
            </button>
          </div>

          {/* Results List */}
          {places.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {places.map((place, index) => (
                <div key={index} className="border rounded-2xl p-5 hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      amenityType === 'school' ? 'bg-blue-100 text-blue-600' :
                      amenityType === 'hospital' || amenityType === 'pharmacy' ? 'bg-red-100 text-red-600' :
                      amenityType === 'park' || amenityType === 'playground' ? 'bg-green-100 text-green-600' :
                      'bg-indigo-100 text-indigo-600'
                    }`}>
                      {getAmenityIcon(amenityType)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">{place.name}</h3>
                      {place.type && (
                        <span className="text-xs text-gray-500 capitalize">{place.type}</span>
                      )}
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                        <Home size={14} />
                        {formatAddress(place)}
                      </p>
                      
                      {/* Distance */}
                      {place.distance && (
                        <p className="text-sm text-indigo-600 font-medium mt-2 flex items-center gap-1">
                          <Navigation size={14} />
                          {formatDistance(place.distance)} km away
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    <a
                      href={getDirectionsLink(place)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm"
                    >
                      <ExternalLink size={16} />
                      Get Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
                amenityType === 'school' ? 'bg-blue-100 text-blue-400' :
                amenityType === 'hospital' || amenityType === 'pharmacy' ? 'bg-red-100 text-red-400' :
                amenityType === 'park' || amenityType === 'playground' ? 'bg-green-100 text-green-400' :
                'bg-indigo-100 text-indigo-400'
              }`}>
                {getAmenityIcon(amenityType)}
              </div>
              <p className="text-lg text-gray-600 font-medium">
                {loading ? 'Searching...' : `No ${currentAmenity?.label} found yet`}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {loading ? 'Please wait...' : 'Click "Search Now" to find nearby places'}
              </p>
            </div>
          )}
        </div>

{/* Kenya Tips Section */}
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-6">
          <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
            <Clock size={18} />
            🇰🇪 Kenya Tips
          </h3>
          <ul className="text-sm text-green-700 space-y-2">
            <li>• Use the city dropdown for quick access to major Kenyan cities</li>
            <li>• Click "Get My Location" to search around your current position</li>
            <li>• Click "Get Directions" to open Google Maps with navigation</li>
            <li>• Tip: Schools and hospitals show up best in Nairobi, Mombasa & Kisumu</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Amenities;
