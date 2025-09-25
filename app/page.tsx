/*"use client"
import { useState } from 'react';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import TenantDashboard from '@/components/dashboards/TenantDashboard';
import AgentDashboard from '@/components/dashboards/AgentDashboard';
import LandlordDashboard from '@/components/dashboards/LandlordDashboard';
import ServiceProviderDashboard from '@/components/dashboards/ServiceProviderDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import PropertiesTab from '@/components/tabs/PropertiesTab';
import PaymentsTab from '@/components/tabs/PaymentsTab';
import SupportTab from '@/components/tabs/SupportTab';
import Login from './login/page';
import HomeTab from '@/components/tabs/HomeTab';
import ServicesTab from '@/components/tabs/ServicesTab';


export default function Home() {
  const { user, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  const renderDashboard = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'tenant':
        return <TenantDashboard />;
      case 'landlord':
        return <LandlordDashboard />;
      case 'agent':
        return <AgentDashboard />;
      case 'service-provider':
        return <ServiceProviderDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <TenantDashboard />;
    }
  };

const renderTabContent = () => {
  if (!user) return null;
  
  switch (activeTab) {
    case 'home':
      return <HomeTab />;
    case 'dashboard':
      return renderDashboard();
    case 'properties':
      return <PropertiesTab role={user.role} />;
    case 'services':
      return <ServicesTab />;
    case 'payments':
      return <PaymentsTab role={user.role} />;
    case 'support':
      return <SupportTab role={user.role} />;
    default:
      return <HomeTab />;
  }
};

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'properties', label: 'Properties', icon: '🏠' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'services', label: 'Services', icon: '🔧' },
    { id: 'support', label: 'Support', icon: '🛟' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Head>
        <title>Rental Property Management System</title>
        <meta name="description" content="Modern rental property management platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-indigo-600 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-bold">R</span>
            </div>
            <h1 className="ml-2 text-white text-xl font-bold">RentalEase</h1>
          </div>
          <nav className="mt-8 flex-1 flex flex-col px-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-white text-indigo-600' 
                    : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="px-4 mt-auto">
            <div className="bg-indigo-700 text-white p-4 rounded-lg">
              <p className="text-sm font-medium">Need help?</p>
              <p className="text-xs mt-1">Contact our support team 24/7</p>
              <button 
                className="mt-3 w-full bg-white text-indigo-600 py-2 rounded-md text-sm font-semibold"
                onClick={() => setActiveTab('support')}
              >
                Get Help
              </button>
            </div>
            <button
              onClick={logout}
              className="mt-4 w-full text-indigo-100 hover:text-white text-sm font-medium text-left"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col w-64 bg-indigo-600 focus:outline-none">
            <div className="pt-5 pb-4">
              <div className="flex items-center px-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">R</span>
                </div>
                <h1 className="ml-2 text-white text-xl font-bold">RentalEase</h1>
                <button
                  className="ml-auto rounded-md p-2 text-indigo-200 hover:text-white focus:outline-none"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  ✕
                </button>
              </div>
              <nav className="mt-8 px-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id 
                        ? 'bg-white text-indigo-600' 
                        : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="px-4 mt-auto">
              <button
                onClick={logout}
                className="w-full text-indigo-100 hover:text-white text-sm font-medium text-left py-4"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="lg:pl-64 flex flex-col flex-1">

        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button
                  className="lg:hidden rounded-md p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  ☰
                </button>
                <div className="flex-1 ml-4 lg:ml-0">
                  <div className="max-w-lg w-full lg:max-w-xs">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Search properties, payments, docs..."
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                
                  {(user.role === 'landlord' || user.role === 'agent' || user.role === 'service-provider') && (
                    <button
                      className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none transition"
                      onClick={() => {
                        if (user.role === 'landlord' || user.role === 'agent') {
                          window.location.href = '/create-property';
                        } else if (user.role === 'service-provider') {
                          window.location.href = '/create-service';
                        }
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  )}

                  <button className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                    <span className="sr-only">Messages</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>

                  <button className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                    <span className="sr-only">View notifications</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>

              
                  <div className="relative">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-8">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}*/

"use client";

import { useState } from 'react';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import TenantDashboard from '@/components/dashboards/TenantDashboard';
import AgentDashboard from '@/components/dashboards/AgentDashboard';
import LandlordDashboard from '@/components/dashboards/LandlordDashboard';
import ServiceProviderDashboard from '@/components/dashboards/ServiceProviderDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import PropertiesTab from '@/components/tabs/PropertiesTab';
import PaymentsTab from '@/components/tabs/PaymentsTab';
import SupportTab from '@/components/tabs/SupportTab';
import Login from './login/page';
import HomeTab from '@/components/tabs/HomeTab';
import ServicesTab from '@/components/tabs/ServicesTab';
import Link from 'next/link';
import UsersTab from '@/components/tabs/UsersTab';


/* ---------- helpers ---------- */

/*const navItems = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'properties', label: 'Properties', icon: '🏠' },
  { id: 'services', label: 'Services', icon: '🔧' },
  { id: 'payments', label: 'Payments', icon: '💳' },
  ...(user?.role === 'admin' ? [{ id: 'users', label: 'Users', icon: '👥' }] : []),
  { id: 'support', label: 'Support', icon: '🛟' },
];*/

/* ---------- page ---------- */
export default function Home() {
  const { user, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'properties', label: 'Properties', icon: '🏠' },
  { id: 'services', label: 'Services', icon: '🔧' },
  { id: 'payments', label: 'Payments', icon: '💳' },
  ...(user?.role === 'admin' ? [{ id: 'users', label: 'Users', icon: '👥' }] : []),
  { id: 'support', label: 'Support', icon: '🛟' },
];


  /* ---------- render ---------- */
  const renderDashboard = () => {
    if (!user) return null;
    switch (user.role) {
      case 'tenant':          return <TenantDashboard />;
      case 'landlord':        return <LandlordDashboard />;
      case 'agent':           return <AgentDashboard />;
      case 'service-provider':return <ServiceProviderDashboard />;
      case 'admin':           return <AdminDashboard />;
      default:                return <TenantDashboard />;
    }
  };

  const renderTabContent = () => {
    if (!user) return null;
    switch (activeTab) {
      case 'home':       return <HomeTab />;
      case 'dashboard':  return renderDashboard();
      case 'properties': return <PropertiesTab />;
      case 'services':   return <ServicesTab />;
      case 'payments':   return <PaymentsTab role={user.role} />;
      case 'support':    return <SupportTab role={user.role} />;
      case 'users':       return <UsersTab role={user.role} />;
      default:           return <HomeTab />;
    }
  };

  /* ---------- loading / auth wall ---------- */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!user) return <Login />;

  /* ---------- markup ---------- */
  return (
    <>
      <Head>
        <title>RentalEase | Property Management</title>
        <meta name="description" content="Modern rental property management platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex">
        {/* ---------------- DESKTOP SIDEBAR ---------------- */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-indigo-600 pt-5 pb-4 overflow-y-auto">
            {/* logo */}
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="w-8 h-8 bg-white rounded-full grid place-items-center">
                <span className="text-indigo-600 font-bold">M</span>
              </div>
              <h1 className="ml-2 text-white text-xl font-bold">M-keja</h1>
            </div>

            {/* nav */}
            <nav className="mt-8 flex-1 px-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-white text-indigo-600'
                      : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                  }`}
                >
                  {/*<span className="mr-3">{item.icon}</span>*/}
                  <span className="text-sm font-medium break-words">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* support card + logout */}
            <div className="px-4 mt-auto space-y-4">
              <div className="bg-indigo-700 text-white p-4 rounded-lg">
                <p className="text-sm font-medium">Need help?</p>
                <p className="text-xs mt-1">Contact our support team 24/7</p>
                <button
                  onClick={() => setActiveTab('support')}
                  className="mt-3 w-full bg-white text-indigo-600 py-2 rounded-md text-sm font-semibold"
                >
                  Get Help
                </button>
              </div>
              {/*<button
                onClick={logout}
                className="w-full text-indigo-100 hover:text-white text-sm font-medium text-left break-words"
              >
                Sign out
              </button>*/}
            </div>
          </div>
        </aside>

        {/* ---------------- MOBILE SIDEBAR ---------------- */}
        {sidebarOpen && (
  <div className="fixed inset-0 z-40 lg:hidden">
    {/* backdrop */}
    <div
      className="absolute inset-0 bg-gray-600/75"
      onClick={() => setSidebarOpen(false)}
      aria-hidden="true"
    />

    {/* drawer – max-w-full prevents it from ever being wider than the viewport */}
    <aside className="relative max-w-full w-64 h-full bg-indigo-600 flex flex-col">
      {/* header */}
      <div className="flex items-center px-4 pt-5">
        <div className="w-8 h-8 bg-white rounded-full grid place-items-center shrink-0">
          <span className="text-indigo-600 font-bold">M</span>
        </div>
        <h1 className="ml-2 text-white text-xl font-bold break-words">M-keja</h1>
        <button
          type="button"
          className="ml-auto rounded-md p-2 text-indigo-200 hover:text-white shrink-0"
          onClick={() => setSidebarOpen(false)}
        >
          <span className="sr-only">Close sidebar</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* nav – min-w-0 lets flex children shrink below their default size */}
      <nav className="mt-8 px-4 space-y-2 min-w-0">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${
              activeTab === item.id
                ? 'bg-white text-indigo-600'
                : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
            }`}
          >
            {/*<span className="mr-3 shrink-0">{item.icon}</span>*/}
            {/* text wraps and can break if necessary */}
            <span className="text-sm font-medium text-left break-words">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* footer *
      <div className="mt-auto px-4 pb-4">
        <button
          onClick={logout}
          className="w-full text-left text-indigo-100 hover:text-white text-sm font-medium break-words py-3"
        >
          Sign out
        </button>
      </div>*/}
    </aside>
  </div>
)}
        {/* ---------------- MAIN AREA ---------------- */}
        <div className="lg:pl-64 flex flex-col flex-1 w-full">
          {/* header */}
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                {/* left: hamburger + search */}
                <div className="flex items-center flex-1">
                  <button
                    className="lg:hidden rounded-md p-2 text-gray-400 hover:text-gray-500"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <span className="sr-only">Open sidebar</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>

                  <div className="ml-4 lg:ml-0 w-full lg:max-w-sm">
                    <label htmlFor="search" className="sr-only">Search</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        id="search"
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search properties, payments, docs..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* right: icons + avatar */}
                <div className="flex items-center">
                  <div className="flex items-center space-x-3">
                    {/* plus */}
                    {(user.role === 'landlord' || user.role === 'agent' || user.role === 'service-provider') && (
                      <button
                        type="button"
                        onClick={() => {
                          if (user.role === 'landlord' || user.role === 'agent') {
                            window.location.href = '/create-property';
                          } else {
                            window.location.href = '/create-service';
                          }
                        }}
                        className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-500"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    )}

                    {/* messages */}
                    <button type="button" className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Messages</span>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>

                    {/* notifications */}
                    <button type="button" className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-500">
                      <span className="sr-only">View notifications</span>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </button>
                  {/* avatar */}
                  <Link href="/profile" className="relative cursor-pointer">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full grid place-items-center text-white font-semibold break-all">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-green-400 border-2 border-white" />
                  </Link>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* page content */}
          <main className="flex-1">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              {renderTabContent()}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}