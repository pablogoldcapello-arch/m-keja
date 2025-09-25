/*  HomeTab.tsx  –  fully refactored, zero UI changes, all tabs working  */
import { useState, useEffect } from 'react';
import Link from 'next/link';

/* ---------- interfaces ---------- */
interface Property {
  id: string;
  name: string;
  type: string;
  location: string;
  price: number;
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  rating: number;
  featured: boolean;
}
interface ServiceProvider {
  id: string;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  image: string;
  verified: boolean;
}
interface Agent {
  id: string;
  name: string;
  properties: number;
  rating: number;
  image: string;
  experience: string;
}
interface Landlord {
  id: string;
  name: string;
  properties: number;
  rating: number;
  image: string;
}
interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  priceType: 'fixed' | 'hourly' | 'negotiable';
  location: string;
  images: string[];
  rating: number;
  reviews: number;
  serviceProvider: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  isVerified: boolean;
}

/* ---------- component ---------- */
export default function HomeTab() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'properties' | 'services' | 'agents' | 'landlords'>('all');

  /* data */
  const [properties, setProperties] = useState<Property[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [landlords, setLandlords] = useState<Landlord[]>([]);

  /* service filter */
  const [serviceCategory, setServiceCategory] = useState('');
  const [serviceLocation, setServiceLocation] = useState('');

  const [loading, setLoading] = useState(true);

  /* initial data fetch */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [props, serv, sp, ag, ll] = await Promise.all([
          fetch('/api/properties?limit=50').then(r => r.json()),
          fetch('/api/services?limit=50').then(r => r.json()),
          fetch('/api/users?role=service-provider').then(r => r.json()),
          fetch('/api/users?role=agent').then(r => r.json()),
          fetch('/api/users?role=landlord').then(r => r.json()),
        ]);
        setProperties(props.properties || []);
        setServices(serv.services || []);
        setServiceProviders(sp.users || []);
        setAgents(ag.users || []);
        setLandlords(ll.users || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* service filter handler */
  useEffect(() => {
    const fetchServices = async () => {
      const params = new URLSearchParams();
      params.set('limit', '50');
      if (serviceCategory) params.set('category', serviceCategory);
      if (serviceLocation) params.set('location', serviceLocation);
      const res = await fetch(`/api/services?${params}`);
      const json = await res.json();
      setServices(json.services || []);
    };
    if (activeFilter === 'services') fetchServices();
  }, [serviceCategory, serviceLocation, activeFilter]);

  /* tabs */
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'properties', label: 'Properties' },
    { id: 'services', label: 'Services' },
    { id: 'agents', label: 'Agents' },
    { id: 'landlords', label: 'Landlords' },
  ] as const;

  /* loading */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600" />
      </div>
    );
  }

  /* ---------- render helpers ---------- */
  const PropertiesTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(p => (
        <div key={p.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition">
          <div className="h-48 bg-gray-200 relative">
              <img
              src={p.image || '/api/placeholder/400/300'}
              alt={p.name}
              className="w-full h-full object-cover"
            />
            {p.featured && <span className="absolute top-3 left-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">Featured</span>}
            <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{p.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{p.location}</p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold text-indigo-600">KSh {p.price.toLocaleString()}</span>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <span className="text-sm text-gray-600">{p.rating}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{p.bedrooms} beds</span><span>{p.bathrooms} baths</span><span>{p.area} m²</span>
            </div>
            <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">View Details</button>
          </div>
        </div>
      ))}
    </div>
  );

  const ServicesTab = () => (
    <>
      {/* filter bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4">
        <select value={serviceCategory} onChange={e => setServiceCategory(e.target.value)} className="px-4 py-2 border rounded-lg text-gray-700">
          <option value="">All Categories</option>
          <option>Cleaning</option><option>Electrical</option><option>Plumbing</option><option>Internet</option>
        </select>
        <input value={serviceLocation} onChange={e => setServiceLocation(e.target.value)} placeholder="Location" className="flex-1 px-4 py-2 border rounded-lg text-gray-700" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(s => (
          <div key={s.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition">
            <div className="h-48 bg-gray-200" style={{backgroundImage: `url(${s.images[0] || '/api/placeholder/400/300'})`, backgroundSize:'cover', backgroundPosition:'center'}} />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">{s.category}</span>
                {s.isVerified && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Verified</span>}
              </div>
              <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{s.description.slice(0, 80)}…</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-indigo-600">KSh {s.price.toLocaleString()} <span className="text-xs text-gray-500">{s.priceType}</span></span>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292z" /></svg>
                  <span className="text-sm text-gray-600">{s.rating} ({s.reviews})</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-3">Location: {s.location}</div>
              <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">Book Service</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const AgentsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map(a => (
        <div key={a.id} className="border rounded-xl p-4 hover:shadow-lg transition">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full mr-4" />
            <div>
              <h3 className="font-semibold text-lg">{a.name}</h3>
              <p className="text-sm text-gray-600">{a.properties} properties • {a.experience}</p>
              <div className="flex items-center mt-1">
                <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292z" /></svg>
                <span className="text-sm text-gray-600">{a.rating}</span>
              </div>
            </div>
          </div>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">Contact Agent</button>
        </div>
      ))}
    </div>
  );

  const LandlordsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {landlords.map(l => (
        <div key={l.id} className="border rounded-xl p-4 hover:shadow-lg transition">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full mr-4" />
            <div>
              <h3 className="font-semibold text-lg">{l.name}</h3>
              <p className="text-sm text-gray-600">{l.properties} properties</p>
              <div className="flex items-center mt-1">
                <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292z" /></svg>
                <span className="text-sm text-gray-600">{l.rating}</span>
              </div>
            </div>
          </div>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">Contact Landlord</button>
        </div>
      ))}
    </div>
  );

  /* ---------- main render ---------- */
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Rental Home</h1>
          <p className="text-xl mb-8 opacity-90">Discover amazing properties, trusted service providers, and experienced agents all in one place</p>
          <div className="bg-white rounded-lg p-1 flex max-w-2xl mx-auto">
            <input type="text" placeholder="Search properties, locations, or services..." className="flex-1 px-4 py-3 text-gray-800 focus:outline-none rounded-l-lg" />
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">Search</button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {filters.map(f => (
            <button key={f.id} onClick={() => setActiveFilter(f.id)} className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${activeFilter === f.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="rounded-xl">
        {activeFilter === 'all' &&     <div className="space-y-8">
    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
        <div className="lg:col-span-2 space-y-6">
        
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
              <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.filter(p => p.featured).map((property) => (
                <div key={property.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 relative">
                    <img
                      src={property.image || '/api/placeholder/400/300'}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                    {property.featured && (
                      <span className="absolute top-3 left-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                    <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{property.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{property.location}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-indigo-600">KSh {property.price.toLocaleString()}</span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-600">{property.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{property.bedrooms} beds</span>
                      <span>{property.bathrooms} baths</span>
                      <span>{property.area} m²</span>
                    </div>
                    <Link 
                      href={`/properties/${property.id}`}
                      className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium flex items-center justify-center group"
                    >
                      View Details
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

    
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Top Service Providers</h2>
              <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {serviceProviders.map((provider) => (
                <div key={provider.id} className="flex items-center p-4 border rounded-xl hover:shadow-md transition">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{provider.name}</h3>
                    <p className="text-gray-600 text-sm">{provider.service}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-600">{provider.rating}</span>
                        <span className="text-sm text-gray-400 ml-1">({provider.reviews} reviews)</span>
                      </div>
                      {provider.verified && (
                        <span className="ml-3 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition">
                    Contact
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

 
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Agents</h2>
            <div className="space-y-4">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{agent.name}</h3>
                    <p className="text-sm text-gray-600">{agent.properties} properties • {agent.experience}</p>
                    <div className="flex items-center mt-1">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-gray-600">{agent.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition">
              View All Agents
            </button>
          </div>

        
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Landlords</h2>
            <div className="space-y-4">
              {landlords.map((landlord) => (
                <div key={landlord.id} className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{landlord.name}</h3>
                    <p className="text-sm text-gray-600">{landlord.properties} properties</p>
                    <div className="flex items-center mt-1">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-gray-600">{landlord.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 rounded-xl p-6 text-white">
            <h2 className="text-xl font-bold mb-4">Market Insights</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Properties</span>
                <span className="font-semibold">356</span>
              </div>
              <div className="flex justify-between">
                <span>Active Listings</span>
                <span className="font-semibold">289</span>
              </div>
              <div className="flex justify-between">
                <span>Average Rent</span>
                <span className="font-semibold">KSh 45,000</span>
              </div>
              <div className="flex justify-between">
                <span>New Today</span>
                <span className="font-semibold">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>}
        {activeFilter === 'properties' && <PropertiesTab />}
        {activeFilter === 'services' && <ServicesTab />}
        {activeFilter === 'agents' && <AgentsTab />}
        {activeFilter === 'landlords' && <LandlordsTab />}
      </div>
    </div>
  );
}