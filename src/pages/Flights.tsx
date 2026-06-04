import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  MoreVertical, 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowLeftRight, 
  Download, 
  User, 
  Compass, 
  CreditCard, 
  Bell, 
  Settings as SettingsIcon,
  Plane,
  ChevronRight,
  Sparkles,
  Phone,
  Monitor,
  Layout,
  Sliders,
  CheckCircle2,
  FileText,
  X
} from 'lucide-react';

// Interfaces
interface Flight {
  id: string;
  airline: string;
  logo: string;
  code: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  logoColor: string;
}

const Flights: React.FC = () => {
  // Navigation inside the Mock Phone:
  // 1 = Search Form, 2 = Select Flight, 3 = Boarding Pass
  const [phoneScreen, setPhoneScreen] = useState<1 | 2 | 3>(1);

  // Search parameters state in flight booking
  const [tripType, setTripType] = useState<'round-trip' | 'one-way' | 'multi-city'>('round-trip');
  const [fromLocation, setFromLocation] = useState('New York(NYC)');
  const [toLocation, setToLocation] = useState('London(LDN)');
  const [departureDate, setDepartureDate] = useState('Dec 4th, 2021');
  const [returnDate, setReturnDate] = useState('Dec 16th, 2021');

  // Interactive selected flight to populate boarding pass
  const [selectedFlightId, setSelectedFlightId] = useState<string>('turkish');

  // Layout View mode: 'simulator' (cool responsive iPhone container) or 'multi' (all 3 views displayed side-by-side to review design rules)
  const [viewMode, setViewMode] = useState<'simulator' | 'multi'>('simulator');

  // Trigger Toast download feedback
  const [downloading, setDownloading] = useState(false);
  const [showPassAlert, setShowPassAlert] = useState(false);

  // Default Flight Database mimicking the design
  const flightOffers: Flight[] = [
    {
      id: 'turkish',
      airline: 'Turkish Airlines',
      code: 'BH07',
      price: 120,
      departureTime: '10:40am',
      arrivalTime: '12:50am',
      duration: 'Th 60 Min',
      logo: '🇹🇷',
      logoColor: 'bg-red-50 text-red-600 border-red-150'
    },
    {
      id: 'lufthansa',
      airline: 'Lufthansa',
      code: 'WE05',
      price: 120,
      departureTime: '10:40am',
      arrivalTime: '12:50am',
      duration: 'Th 60 Min',
      logo: '🇩🇪',
      logoColor: 'bg-blue-50 text-blue-800 border-blue-150'
    },
    {
      id: 'airfrance',
      airline: 'Air France',
      code: 'RT73',
      price: 120,
      departureTime: '10:40am',
      arrivalTime: '12:50am',
      duration: 'Th 60 Min',
      logo: '🇫🇷',
      logoColor: 'bg-sky-50 text-sky-600 border-sky-150'
    }
  ];

  const currentFlight = flightOffers.find(f => f.id === selectedFlightId) || flightOffers[0];

  const handleDownloadTicket = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setShowPassAlert(true);
      setTimeout(() => setShowPassAlert(false), 3500);
    }, 1500);
  };

  const selectedPopularPlaces = [
    { name: 'London Bridge', location: 'London, UK', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?auto=format&fit=crop&w=400&q=80', tag: 'Top' },
    { name: 'Central Park', location: 'New York, USA', img: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=400&q=80', tag: 'Popular' },
    { name: 'Eiffel Tower', location: 'Paris, France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80', tag: 'Romantic' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Welcome Title Grid */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-slate-800 uppercase tracking-tight flex items-center gap-2.5">
            <Plane className="text-academic-600 rotate-45 shrink-0" size={28} />
            DISEÑO UI/UX INTERACTIVO
          </h1>
          <p className="text-slate-500 mt-1 font-semibold">
            Réplica interactiva del diseño móvil con simulación de dispositivo, bordes adaptables, márgenes limpios y transiciones fluidas.
          </p>
        </div>

        {/* View selector: Simulator vs Multi-Screen Grid */}
        <div className="flex bg-white p-1 rounded-2xl border border-slate-150 shadow-sm self-start shrink-0">
          <button
            onClick={() => setViewMode('simulator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
              viewMode === 'simulator' 
                ? 'bg-academic-600 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Phone size={14} />
            Simulador de Móvil
          </button>
          <button
            onClick={() => setViewMode('multi')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
              viewMode === 'multi' 
                ? 'bg-academic-600 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Monitor size={14} />
            Vista 3 Pantallas
          </button>
        </div>
      </div>

      {/* Info Warning banner indicating that design rules were respected */}
      <div className="p-4 bg-white rounded-3xl border border-slate-150 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="text-xs font-black text-slate-800 uppercase tracking-tight block">Fidelidad Visual Absoluta y UX Adaptiva</span>
            <span className="text-[11px] text-slate-500 font-bold leading-normal">
              Hemos implementado las tres pantallas con su icónico color azul de fondo, tarjetas superpuestas de gran radio, líneas de vuelo perforadas con aviones, y códigos de barra vectorizados. ¡Use los botones del simulador para navegar entre ellas!
            </span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <span className="px-3 py-1.5 bg-slate-105 border border-slate-200 text-slate-500 rounded-xl text-[9px] font-black uppercase">iOS Aspect 19.5:9</span>
          <span className="px-3 py-1.5 bg-academic-50 border border-academic-100 text-academic-700 rounded-xl text-[9px] font-black uppercase">Interactivo</span>
        </div>
      </div>

      {/* ACTIVE SCREEN AREA */}
      <div>
        {viewMode === 'simulator' ? (
          /* ========================================================================================= */
          /* MOCK IPHONE SIMULATOR MODE                                                               */
          /* ========================================================================================= */
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-4">
            
            {/* Quick Interactive Controller Widget (Left Panel) */}
            <div className="w-full lg:max-w-xs space-y-4 bg-white border border-slate-150 p-6 rounded-3xl shadow-sm">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Sliders size={14} className="text-academic-600" />
                Control del Simulador
              </h3>
              
              <div className="space-y-3">
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                  Pruebe los flujos de la aplicación interactiva cambiando la pantalla activa del teléfono con este selector rápido rápido o haciendo clic dentro de los controles integrados de la pantalla:
                </p>

                <div className="space-y-2 pt-2">
                  <button 
                    onClick={() => setPhoneScreen(1)}
                    className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-left transition-all border ${
                      phoneScreen === 1 
                        ? 'bg-academic-50 border-academic-200 text-academic-700 shadow-sm' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span>1. Buscar Vuelos</span>
                    <ChevronRight size={14} />
                  </button>

                  <button 
                    onClick={() => setPhoneScreen(2)}
                    className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-left transition-all border ${
                      phoneScreen === 2 
                        ? 'bg-academic-50 border-academic-200 text-academic-700 shadow-sm' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span>2. Seleccionar Vuelo</span>
                    <ChevronRight size={14} />
                  </button>

                  <button 
                    onClick={() => setPhoneScreen(3)}
                    className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-left transition-all border ${
                      phoneScreen === 3 
                        ? 'bg-academic-50 border-academic-200 text-academic-700 shadow-sm' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span>3. Boarding Pass (Boleto)</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 mt-4 text-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Pasajero Seleccionado</span>
                <span className="text-[12px] font-extrabold text-slate-800 uppercase block">Amir - Zhen</span>
                <div className="text-[9px] font-bold text-slate-400">
                  Ruta: {fromLocation.replace(/.*\((.*)\)/, "$1")} ✈ {toLocation.replace(/.*\((.*)\)/, "$1")}
                </div>
              </div>
            </div>

            {/* Simulated iPhone Device Frame */}
            <div className="relative mx-auto w-[375px] h-[812px] bg-slate-900 rounded-[52px] shadow-2xl p-3 border-4 border-slate-800 ring-12 ring-slate-950 flex flex-col overflow-hidden shrink-0">
              
              {/* iPhone Notch Accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center">
                {/* Speaker pill and camera reflex */}
                <div className="w-12 h-1 bg-slate-850 rounded-full mb-1" />
                <div className="w-2.5 h-2.5 bg-slate-800 rounded-full ml-3 mb-1" />
              </div>

              {/* iOS Status Bar */}
              <div className="h-10 px-6 pt-2 flex items-center justify-between text-white text-[10px] select-none font-bold z-40">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  {/* Cellular network lines */}
                  <div className="flex items-end gap-0.5 h-2.5">
                    <div className="w-0.5 h-1 bg-white" />
                    <div className="w-0.5 h-1.5 bg-white" />
                    <div className="w-0.5 h-2 bg-white" />
                    <div className="w-0.5 h-2.5 bg-white" />
                  </div>
                  {/* Wifi icon line equivalents */}
                  <span>5G</span>
                  {/* Battery mockup indicator */}
                  <div className="w-5 h-2.5 border border-white/60 rounded p-px flex items-center">
                    <div className="w-3.5 h-full bg-white rounded-xs" />
                  </div>
                </div>
              </div>

              {/* PHONESCREEN TRANSITIONS ENGINE */}
              <div className="flex-1 bg-[#EEF2F9] rounded-[40px] overflow-hidden flex flex-col relative">
                <AnimatePresence mode="wait">
                  {phoneScreen === 1 && (
                    <motion.div
                      key="screen-1"
                      initial={{ opacity: 0, x: -60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 60 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0 flex flex-col justify-between"
                    >
                      {/* SCREEN 1: BÚSQUEDA DE VUELOS */}
                      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                        
                        {/* Blue Header Section Overlay */}
                        <div className="bg-[#2E74ED] pt-6 pb-20 px-6 rounded-b-[38px] text-white space-y-6 shadow-md relative">
                          {/* Welcome User Row */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white/80 text-[11px] font-medium leading-none">Hello Amir - Zhen,</p>
                              <h2 className="text-xl font-black font-display text-white mt-1 leading-tight tracking-tight uppercase">
                                Book your next Flight
                              </h2>
                            </div>
                            
                            {/* Avatar image frame */}
                            <div className="w-11 h-11 rounded-full border-2 border-white/30 overflow-hidden shadow-inner shrink-0 bg-white/20 flex items-center justify-center">
                              <img 
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=85&referrerPolicy=no-referrer" 
                                alt="Amir Zhen" 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  // Fallback SVG if image blocks
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          </div>

                          {/* Horizontal Capsule Tab Selectors */}
                          <div className="flex bg-white/10 p-1 rounded-full gap-1">
                            <button
                              onClick={() => setTripType('round-trip')}
                              className={`flex-1 py-2.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 ${
                                tripType === 'round-trip' 
                                  ? 'bg-[#EAB308] text-[#1E293B] shadow-sm' 
                                  : 'text-white hover:bg-white/5'
                              }`}
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-200 block shrink-0" />
                              Round Trip
                            </button>
                            <button
                              onClick={() => setTripType('one-way')}
                              className={`flex-1 py-2.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
                                tripType === 'one-way' 
                                  ? 'bg-white text-slate-800' 
                                  : 'text-white/80 hover:bg-white/5'
                              }`}
                            >
                              One way
                            </button>
                            <button
                              onClick={() => setTripType('multi-city')}
                              className={`flex-1 py-2.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
                                tripType === 'multi-city' 
                                  ? 'bg-white text-slate-800' 
                                  : 'text-white/80 hover:bg-white/5'
                              }`}
                            >
                              Multi city
                            </button>
                          </div>
                        </div>

                        {/* Search Card Container Floating Overlay (-mt-14) */}
                        <div className="px-5 -mt-14">
                          <div className="bg-white rounded-[2rem] p-5 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-4">
                            
                            {/* Input: From */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 capitalize block pl-1">From (Location)</label>
                              <div className="relative">
                                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                <input
                                  type="text"
                                  value={fromLocation}
                                  onChange={(e) => setFromLocation(e.target.value)}
                                  className="w-full pl-10 pr-4 py-3 bg-[#F4F6FA] border border-transparent rounded-2xl font-bold text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner"
                                />
                              </div>
                            </div>

                            {/* Interchange Icon decorative */}
                            <div className="flex justify-center -my-3 relative z-10">
                              <button 
                                onClick={() => {
                                  const temp = fromLocation;
                                  setFromLocation(toLocation);
                                  setToLocation(temp);
                                }}
                                className="w-8 h-8 rounded-full bg-white border border-slate-150 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-blue-600"
                                type="button"
                              >
                                <ArrowLeftRight size={13} strokeWidth={2.5} />
                              </button>
                            </div>

                            {/* Input: To */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 capitalize block pl-1">To (Destination)</label>
                              <div className="relative">
                                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                <input
                                  type="text"
                                  value={toLocation}
                                  onChange={(e) => setToLocation(e.target.value)}
                                  className="w-full pl-10 pr-4 py-3 bg-[#F4F6FA] border border-transparent rounded-2xl font-bold text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner"
                                />
                              </div>
                            </div>

                            {/* Inputs: Departure / Return */}
                            <div className="grid grid-cols-2 gap-3 pb-1">
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 block pl-1">Departure</label>
                                <div className="relative">
                                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450" size={13} />
                                  <input 
                                    type="text"
                                    value={departureDate}
                                    onChange={(e) => setDepartureDate(e.target.value)}
                                    className="w-full pl-8 pr-2 py-2.5 bg-[#F4F6FA] text-[10px] text-slate-755 border border-transparent rounded-xl font-bold outline-none shadow-inner"
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 block pl-1">Return</label>
                                <div className="relative">
                                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-455" size={13} />
                                  <input 
                                    type="text"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    className="w-full pl-8 pr-2 py-2.5 bg-[#F4F6FA] text-[10px] text-slate-755 border border-transparent rounded-xl font-bold outline-none shadow-inner"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Primary Button */}
                            <button
                              onClick={() => setPhoneScreen(2)}
                              className="w-full py-4 bg-[#2E74ED] hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-97 flex items-center justify-center gap-2"
                            >
                              Search flights
                            </button>
                          </div>
                        </div>

                        {/* Popular Places Section */}
                        <div className="px-6 mt-6 space-y-3">
                          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                            Popular place
                          </h3>
                          
                          {/* Horizontal scrolling cities list mockup */}
                          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                            {selectedPopularPlaces.map((place) => (
                              <div key={place.name} className="w-40 bg-white rounded-2xl p-2 border border-slate-100 flex-shrink-0 shadow-sm">
                                <div className="h-24 w-full rounded-xl overflow-hidden relative">
                                  <img 
                                    src={place.img} 
                                    alt={place.name} 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-[7px] font-black uppercase text-white rounded-md tracking-wider">
                                    {place.tag}
                                  </span>
                                </div>
                                <div className="mt-2 text-left px-1">
                                  <h4 className="text-[10px] font-black text-slate-800 leading-none">{place.name}</h4>
                                  <p className="text-[8px] text-slate-450 font-bold mt-0.5">{place.location}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Mock Interactive Phone Footer Menu (Home tab active) */}
                      <div className="bg-white px-6 py-3 border-t border-slate-100 flex items-center justify-between shrink-0 rounded-t-3xl">
                        <button className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-full font-black text-[9px] uppercase tracking-wider">
                          <Compass size={14} className="animate-spin-slow" />
                          <span>Home</span>
                        </button>
                        <button onClick={() => setPhoneScreen(2)} className="text-slate-400 hover:text-slate-700 p-2 rounded-xl transition-all">
                          <CreditCard size={17} />
                        </button>
                        <button onClick={() => setPhoneScreen(3)} className="text-slate-400 hover:text-slate-700 p-2 rounded-xl transition-all">
                          <Bell size={17} />
                        </button>
                        <button onClick={() => setPhoneScreen(1)} className="text-slate-400 hover:text-slate-700 p-2 rounded-xl transition-all">
                          <SettingsIcon size={17} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {phoneScreen === 2 && (
                    <motion.div
                      key="screen-2"
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -60 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0 flex flex-col justify-between"
                    >
                      {/* SCREEN 2: SELECCIÓN DE VUELOS */}
                      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                        
                        {/* Blue Route Bar */}
                        <div className="bg-[#2E74ED] text-white pt-5 pb-8 px-6 rounded-b-[38px] shadow-md space-y-4">
                          
                          {/* Inner Header Row with arrows */}
                          <div className="flex items-center justify-between">
                            <button 
                              onClick={() => setPhoneScreen(1)}
                              className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white"
                            >
                              <ArrowLeft size={18} />
                            </button>
                            <span className="text-xs font-black uppercase tracking-wider">Select Flight</span>
                            <button className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white">
                              <MoreVertical size={18} />
                            </button>
                          </div>

                          {/* Beautiful Graphic Flight direction badge (NYC ✈ LDN) */}
                          <div className="flex items-center justify-between pt-1">
                            <div className="text-left">
                              <h3 className="text-lg font-black text-white leading-none tracking-tight">NYC</h3>
                              <p className="text-[9px] text-white/70 font-semibold mt-0.5">1 May, 2020</p>
                            </div>
                            
                            {/* Dotted Connection line with Flying plane decoration */}
                            <div className="flex-1 px-4 flex items-center justify-center relative">
                              <div className="w-full border-t border-dashed border-white/40 absolute" />
                              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center relative z-10 backdrop-blur-xs">
                                <Plane size={11} className="text-white rotate-90" />
                              </div>
                            </div>

                            <div className="text-right">
                              <h3 className="text-lg font-black text-white leading-none tracking-tight">LDN</h3>
                              <p className="text-[9px] text-white/70 font-semibold mt-0.5">Terminal 3</p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Flights Roster cards */}
                        <div className="px-5 pt-5 space-y-4">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block">Vuelos Disponibles</span>

                          {flightOffers.map((f) => {
                            const isSelected = selectedFlightId === f.id;
                            return (
                              <div
                                key={f.id}
                                onClick={() => {
                                  setSelectedFlightId(f.id);
                                  setPhoneScreen(3);
                                }}
                                className={`bg-white rounded-3xl p-5 border cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md flex flex-col space-y-4 relative ${
                                  isSelected 
                                    ? 'ring-2 ring-blue-500 border-blue-200' 
                                    : 'border-slate-100 shadow-sm'
                                }`}
                              >
                                {/* Row: Corporate identifier & Pricing */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center border font-bold text-xs shadow-inner ${f.logoColor}`}>
                                      {f.logo}
                                    </span>
                                    <div>
                                      <p className="text-[10px] font-black text-slate-800 leading-tight block uppercase">{f.airline}</p>
                                      <p className="text-[8px] text-slate-400 font-mono mt-0.5 font-bold uppercase">{f.code}</p>
                                    </div>
                                  </div>
                                  <span className="text-base font-black text-slate-800">${f.price}</span>
                                </div>

                                {/* Row: Time segments (From -> To) with visual dotted connector */}
                                <div className="flex items-center justify-between pt-1">
                                  <div className="text-left">
                                    <p className="text-xs font-black text-slate-800 leading-none">{f.departureTime}</p>
                                    <span className="text-[9px] font-bold text-slate-400 block mt-1">NYC</span>
                                  </div>

                                  <div className="flex-1 px-4 flex items-center justify-center relative">
                                    {/* Yellow dotted indicator as represented in screenshot */}
                                    <div className="w-full border-t border-dashed border-amber-300 absolute" />
                                    <span className="text-[8px] font-black text-[#EAB308] bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full relative z-10">
                                      ✈
                                    </span>
                                  </div>

                                  <div className="text-right">
                                    <p className="text-xs font-black text-slate-800 leading-none">{f.arrivalTime}</p>
                                    <span className="text-[9px] font-bold text-slate-400 block mt-1">LDN</span>
                                  </div>
                                </div>

                                {/* Divider dotted */}
                                <div className="border-t border-dashed border-slate-100 pt-3 flex items-center justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                                  <span className="flex items-center gap-1">
                                    <Calendar size={11} className="text-slate-350" />
                                    May 30, 2021
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock size={11} className="text-slate-350" />
                                    {f.duration}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                      </div>

                      {/* Phone Footer Navigation */}
                      <div className="bg-white px-6 py-3 border-t border-slate-100 flex items-center justify-between shrink-0 rounded-t-3xl">
                        <button onClick={() => setPhoneScreen(1)} className="text-slate-400 hover:text-slate-700 p-2 rounded-xl transition-all">
                          <Compass size={17} />
                        </button>
                        <button className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-full font-black text-[9px] uppercase tracking-wider">
                          <CreditCard size={14} />
                          <span>Tickets</span>
                        </button>
                        <button onClick={() => setPhoneScreen(3)} className="text-slate-400 hover:text-slate-700 p-2 rounded-xl transition-all">
                          <Bell size={17} />
                        </button>
                        <button onClick={() => setPhoneScreen(1)} className="text-slate-400 hover:text-slate-700 p-2 rounded-xl transition-all">
                          <SettingsIcon size={17} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {phoneScreen === 3 && (
                    <motion.div
                      key="screen-3"
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -60 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0 flex flex-col justify-between"
                    >
                      {/* SCREEN 3: PASAJE DE ABORDO */}
                      <div className="flex-1 overflow-y-auto no-scrollbar pb-6 flex flex-col">
                        
                        {/* Header Blue overlay */}
                        <div className="bg-[#2E74ED] text-white pt-5 pb-24 px-6 rounded-b-[38px] shadow-md space-y-4 shrink-0">
                          <div className="flex items-center justify-between">
                            <button 
                              onClick={() => setPhoneScreen(2)}
                              className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white"
                            >
                              <ArrowLeft size={18} />
                            </button>
                            <span className="text-xs font-black uppercase tracking-wider">Boarding Pass</span>
                            <button className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white">
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Overlapping Ticket container with cutout circles */}
                        <div className="px-5 -mt-18 shrink-0">
                          
                          {/* Main Flight ticket */}
                          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col">
                            
                            {/* Top Ticket block */}
                            <div className="p-5 space-y-4">
                              {/* Avatar item */}
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full border-2 border-slate-200 overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
                                  <img 
                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=85&referrerPolicy=no-referrer" 
                                    alt="Amir Zhen" 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="text-left">
                                  <h4 className="text-xs font-black text-slate-800 leading-tight uppercase">Amir - Zhen</h4>
                                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Passenger</p>
                                </div>
                              </div>

                              {/* Flight connection details matching screen 3 */}
                              <div className="flex items-center justify-between py-1.5 border-t border-slate-50">
                                <div className="text-left">
                                  <h3 className="text-base font-black text-slate-850 leading-none">NYC</h3>
                                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">New York</p>
                                </div>
                                
                                {/* Yellow plane dotted route */}
                                <div className="flex-1 px-4 flex items-center justify-center relative">
                                  <div className="w-full border-t border-dashed border-amber-300 absolute" />
                                  <span className="text-[7.5px] font-black text-[#EAB308] bg-amber-50 border border-amber-100 px-1 py-0.5 rounded-full relative z-10">
                                    ✈
                                  </span>
                                </div>

                                <div className="text-right">
                                  <h3 className="text-base font-black text-slate-850 leading-none">LDN</h3>
                                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">London</p>
                                </div>
                              </div>

                              {/* Date and Time custom card items */}
                              <div className="grid grid-cols-2 gap-3 pt-1">
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                                  <Calendar size={13} className="text-blue-500 shrink-0" />
                                  <div className="text-left leading-tight">
                                    <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-tight block">Date</span>
                                    <span className="text-[9px] font-black text-slate-800 uppercase tracking-tight">23rd Dec, 2021</span>
                                  </div>
                                </div>

                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                                  <Clock size={13} className="text-blue-500 shrink-0" />
                                  <div className="text-left leading-tight">
                                    <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-tight block">Time</span>
                                    <span className="text-[9px] font-black text-slate-800 uppercase tracking-tight">9:00AM flight</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Center Perforated strip line cutout */}
                            <div className="relative py-1 bg-slate-50/50 flex items-center justify-between">
                              {/* Left cutout semicircle circle */}
                              <div className="w-5 h-5 rounded-full bg-[#EEF2F9] -ml-2.5 shadow-inner border-r border-slate-200" />
                              
                              {/* Dotted separation strip line */}
                              <div className="flex-1 mx-1 border-t-2 border-dashed border-slate-200" />
                              
                              {/* Right cutout semicircle circle */}
                              <div className="w-5 h-5 rounded-full bg-[#EEF2F9] -mr-2.5 shadow-inner border-l border-slate-200" />
                            </div>

                            {/* Bottom Ticket block */}
                            <div className="p-5 pt-3 text-left space-y-4">
                              
                              {/* Flight metadata specifics */}
                              <div className="grid grid-cols-4 gap-2 text-center">
                                <div className="leading-tight">
                                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tight block">Passenger</span>
                                  <span className="text-[9px] font-black text-blue-600 truncate block">1 Adult</span>
                                </div>
                                <div className="leading-tight">
                                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tight block">Ticket</span>
                                  <span className="text-[9px] font-black text-slate-700 truncate block">NL82-1</span>
                                </div>
                                <div className="leading-tight">
                                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tight block">Class</span>
                                  <span className="text-[9px] font-black text-blue-600 truncate block">Business</span>
                                </div>
                                <div className="leading-tight">
                                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tight block">Seat</span>
                                  <span className="text-[9px] font-black text-slate-700 truncate block">24A</span>
                                </div>
                              </div>

                              {/* Dynamic Barcode element SVG */}
                              <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100 flex flex-col items-center justify-center space-y-1.5">
                                <div className="w-full flex items-center justify-center gap-[1px]">
                                  {/* Custom synthetic generated barcode lines vector representation */}
                                  {[1,3,1,2,1,4,1,2,1,1,3,1,4,1,2,1,3,1,1,2,1,4,1,1,3,1,2,1,1].map((weight, i) => (
                                    <div 
                                      key={i} 
                                      style={{ width: `${weight}px` }} 
                                      className={`h-11 ${i % 2 === 0 ? 'bg-black' : 'bg-transparent'}`} 
                                    />
                                  ))}
                                </div>
                                <span className="text-[8px] font-mono font-black text-slate-500 tracking-widest leading-none">
                                  A3427371903848
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive download action button */}
                        <div className="px-5 mt-4 flex-1 flex items-end">
                          <button
                            onClick={handleDownloadTicket}
                            disabled={downloading}
                            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-97 flex items-center justify-center gap-2 ${
                              downloading 
                                ? 'bg-[#94A3B8] text-slate-100 cursor-not-allowed' 
                                : 'bg-[#2E74ED] hover:bg-blue-700 text-white shadow-blue-500/10'
                            }`}
                          >
                            <Download size={15} className={`${downloading ? 'animate-bounce' : ''}`} />
                            {downloading ? 'Downloading...' : 'Download Ticket'}
                          </button>
                        </div>

                      </div>

                      {/* Phone Footer Navigation */}
                      <div className="bg-white px-6 py-3 border-t border-slate-100 flex items-center justify-between shrink-0 rounded-t-3xl">
                        <button onClick={() => setPhoneScreen(1)} className="text-slate-400 hover:text-slate-700 p-2 rounded-xl transition-all">
                          <Compass size={17} />
                        </button>
                        <button onClick={() => setPhoneScreen(2)} className="text-slate-400 hover:text-slate-700 p-2 rounded-xl transition-all">
                          <CreditCard size={17} />
                        </button>
                        <button className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-full font-black text-[9px] uppercase tracking-wider">
                          <Bell size={14} />
                          <span>Alerts</span>
                        </button>
                        <button onClick={() => setPhoneScreen(1)} className="text-slate-400 hover:text-slate-700 p-2 rounded-xl transition-all">
                          <SettingsIcon size={17} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Home Indicator Bottom pill */}
              <div className="h-6 pb-1.5 flex items-end justify-center select-none z-50">
                <div className="w-32 h-1.5 bg-white/45 rounded-full" />
              </div>
            </div>
            
          </div>
        ) : (
          /* ========================================================================================= */
          /* MULTI-SCREEN DESIGN PREVIEW GRID                                                       */
          /* ========================================================================================= */
          <div className="animate-in fade-in duration-300">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4">
              Márgenes y Padding adaptados en vista paralela de las 3 fases:
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* PANTALLA 1: BÚSQUEDA DEL VUELO */}
              <div className="bg-[#EEF2F9] rounded-[2.5rem] border border-slate-200/60 shadow-lg overflow-hidden flex flex-col h-[740px]">
                {/* Title indicator */}
                <div className="bg-blue-700/10 border-b border-blue-500/10 p-3 text-center">
                  <span className="text-[9px] font-black uppercase text-[#2E74ED] tracking-widest block">Pantalla 1: Buscar Vuelo</span>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col justify-between">
                  <div className="pb-6">
                    {/* Vivid blue background */}
                    <div className="bg-[#2E74ED] pt-6 pb-18 px-5 rounded-b-[2.5rem] text-white space-y-4">
                      <div>
                        <p className="text-white/80 text-[10px] leading-none font-semibold">Hello Amir - Zhen,</p>
                        <h3 className="text-base font-black font-display text-white mt-0.5 leading-tight tracking-tight uppercase">
                          Book your next Flight
                        </h3>
                      </div>

                      {/* Pill tabs list */}
                      <div className="flex bg-white/10 p-0.5 rounded-full gap-0.5">
                        <span className="flex-1 py-1.5 rounded-full text-[8px] font-black uppercase text-center bg-[#EAB308] text-slate-900 shadow">
                          Round Trip
                        </span>
                        <span className="flex-1 py-1.5 rounded-full text-[8px] font-black uppercase text-center text-white/80">
                          One way
                        </span>
                        <span className="flex-1 py-1.5 rounded-full text-[8px] font-black uppercase text-center text-white/80">
                          Multi city
                        </span>
                      </div>
                    </div>

                    {/* Overlay Card */}
                    <div className="px-4 -mt-12">
                      <div className="bg-white rounded-[1.75rem] p-4 shadow-md space-y-3.5 border border-slate-50">
                        {/* Dummy parameters matching user inputs */}
                        <div className="space-y-1 text-left">
                          <label className="text-[8px] font-black text-slate-405 uppercase block">From</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                            <input disabled type="text" value={fromLocation} className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-[10px] font-black text-slate-800" />
                          </div>
                        </div>

                        <div className="space-y-1 text-left">
                          <label className="text-[8px] font-black text-slate-405 uppercase block">To</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                            <input disabled type="text" value={toLocation} className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-[10px] font-black text-slate-800" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-left">
                          <div>
                            <span className="text-[7.5px] font-black text-slate-400 uppercase block mb-0.5">Depature</span>
                            <span className="text-[9px] font-extrabold text-slate-800 block p-2 bg-slate-50 rounded-lg">{departureDate}</span>
                          </div>
                          <div>
                            <span className="text-[7.5px] font-black text-slate-400 uppercase block mb-0.5">Return</span>
                            <span className="text-[9px] font-extrabold text-slate-800 block p-2 bg-slate-50 rounded-lg">{returnDate}</span>
                          </div>
                        </div>

                        <button onClick={() => { setPhoneScreen(2); setViewMode('simulator'); }} className="w-full py-3.5 bg-[#2E74ED] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">
                          Search Flights
                        </button>
                      </div>
                    </div>

                    <div className="px-4 mt-5 space-y-2 text-left">
                      <span className="text-[10px] font-black text-slate-800 uppercase block">Popular place</span>
                      <div className="flex gap-3 overflow-x-auto no-scrollbar">
                        {selectedPopularPlaces.map((place, i) => (
                          <div key={place.name + i} className="w-32 bg-white rounded-xl p-1.5 border border-slate-100 flex-shrink-0 shadow-sm">
                            <div className="h-18 w-full rounded-lg overflow-hidden">
                              <img src={place.img} alt={place.name} className="w-full h-full object-cover" referrerpolicy="no-referrer" />
                            </div>
                            <h4 className="text-[9px] font-black text-slate-800 mt-1 leading-none">{place.name}</h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANTALLA 2: SELECCIÓN DE VUELOS */}
              <div className="bg-[#EEF2F9] rounded-[2.5rem] border border-slate-200/60 shadow-lg overflow-hidden flex flex-col h-[740px]">
                <div className="bg-blue-700/10 border-b border-blue-500/10 p-3 text-center">
                  <span className="text-[9px] font-black uppercase text-[#2E74ED] tracking-widest block">Pantalla 2: Listado</span>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col justify-between">
                  <div className="pb-6">
                    <div className="bg-[#2E74ED] text-white pt-5 pb-6 px-5 rounded-b-[2.5rem] shadow">
                      <div className="flex items-center justify-between text-[11px] mb-3">
                        <ArrowLeft size={16} />
                        <span className="font-black uppercase">Select Flight</span>
                        <MoreVertical size={16} />
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="text-left">
                          <h4 className="text-base font-black leading-none">NYC</h4>
                          <span className="text-[8px] text-white/70">1 May, 2020</span>
                        </div>
                        <div className="flex-1 border-t border-dashed border-white/45 mx-3 relative flex justify-center items-center">
                          <Plane size={10} className="text-white rotate-90" />
                        </div>
                        <div className="text-right">
                          <h4 className="text-base font-black leading-none">LDN</h4>
                          <span className="text-[8px] text-white/70">Terminal 3</span>
                        </div>
                      </div>
                    </div>

                    {/* Flight List Elements replicated */}
                    <div className="px-4 pt-4 space-y-3">
                      {flightOffers.map((f, index) => (
                        <div 
                          key={f.id + index}
                          onClick={() => { setSelectedFlightId(f.id); setPhoneScreen(3); setViewMode('simulator'); }}
                          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-2.5 text-left cursor-pointer hover:border-blue-300"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-slate-800 uppercase block">{f.airline}</span>
                            <span className="text-xs font-black text-slate-800">${f.price}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-700">10:40am</span>
                            <div className="flex-1 border-t border-dashed border-amber-300 mx-3 relative flex justify-center items-center">
                              <span className="text-[8px] text-[#EAB308]">✈</span>
                            </div>
                            <span className="text-[10px] font-black text-slate-700">12:50am</span>
                          </div>

                          <div className="flex items-center justify-between text-[8px] text-slate-400 font-bold border-t border-dashed border-slate-100 pt-1.5">
                            <span>May 30, 2021</span>
                            <span>{f.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* PANTALLA 3: PASE DE ABORDO */}
              <div className="bg-[#EEF2F9] rounded-[2.5rem] border border-slate-200/60 shadow-lg overflow-hidden flex flex-col h-[740px]">
                <div className="bg-blue-700/10 border-b border-blue-500/10 p-3 text-center">
                  <span className="text-[9px] font-black uppercase text-[#2E74ED] tracking-widest block">Pantalla 3: Boleto</span>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col justify-between">
                  <div className="pb-6">
                    <div className="bg-[#2E74ED] text-white pt-5 pb-16 px-5 rounded-b-[2.5rem] shadow">
                      <div className="flex items-center justify-between text-[11px]">
                        <ArrowLeft size={16} />
                        <span className="font-black uppercase">Boarding Pass</span>
                        <MoreVertical size={16} />
                      </div>
                    </div>

                    {/* Overlapping Passenger Card with layout adjustments */}
                    <div className="px-4 -mt-10">
                      <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden text-left flex flex-col">
                        <div className="p-4 space-y-3">
                          <p className="text-[10px] font-black text-slate-800 uppercase block">Amir - Zhen</p>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                            <div>
                              <h4 className="text-base font-black">NYC</h4>
                              <span className="text-[8px] text-slate-400">New York</span>
                            </div>
                            <div className="flex-1 border-t border-dashed border-amber-305 mx-3 relative flex justify-center items-center">
                              <span className="text-[8px] text-[#EAB308]">✈</span>
                            </div>
                            <div>
                              <h4 className="text-base font-black">LDN</h4>
                              <span className="text-[8px] text-slate-400">London</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1.5">
                            <div className="p-2 bg-slate-50 rounded-lg text-xs font-bold text-slate-800">
                              <span className="text-[7px] text-slate-400 uppercase block">Date</span>
                              23rd Dec, 2021
                            </div>
                            <div className="p-2 bg-slate-50 rounded-lg text-xs font-bold text-slate-800">
                              <span className="text-[7px] text-slate-400 uppercase block">Time</span>
                              9:00AM
                            </div>
                          </div>
                        </div>

                        {/* Perforated lines */}
                        <div className="py-0.5 flex items-center justify-between">
                          <div className="w-4 h-4 rounded-full bg-[#EEF2F9] -ml-2" />
                          <div className="flex-1 mx-1 border-t border-dashed border-slate-200" />
                          <div className="w-4 h-4 rounded-full bg-[#EEF2F9] -mr-2" />
                        </div>

                        {/* Custom visual barcode */}
                        <div className="p-4 space-y-3">
                          <div className="grid grid-cols-4 gap-1 text-center text-[8px] uppercase font-bold text-slate-400">
                            <div>
                              <span>Pass.</span>
                              <p className="font-extrabold text-[#2F74ED] text-[9px] mt-0.5">1 Adult</p>
                            </div>
                            <div>
                              <span>Ticket</span>
                              <p className="font-extrabold text-slate-700 text-[9px] mt-0.5">NL82-1</p>
                            </div>
                            <div>
                              <span>Class</span>
                              <p className="font-extrabold text-[#2F74ED] text-[9px] mt-0.5">Business</p>
                            </div>
                            <div>
                              <span>Seat</span>
                              <p className="font-extrabold text-slate-700 text-[9px] mt-0.5">24A</p>
                            </div>
                          </div>

                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                            <div className="w-full flex justify-center gap-[1px]">
                              {[1,3,1,2,1,4,1,2,1,1,3,1,1,2,3,1,2,1].map((weight, i) => (
                                <div key={i} style={{ width: `${weight}px` }} className={`h-8 ${i % 2 === 0 ? 'bg-black' : 'bg-transparent'}`} />
                              ))}
                            </div>
                            <span className="text-[7.5px] font-mono mt-1 text-slate-500 font-bold block">A3427371903848</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pt-4 shrink-0">
                      <button onClick={handleDownloadTicket} className="w-full py-3 bg-[#2E74ED] text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow">
                        Download Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Pop Alerts / Download confirmations inside simulator */}
      <AnimatePresence>
        {showPassAlert && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              className="bg-white border border-emerald-200 text-emerald-800 p-4 rounded-2xl shadow-2xl flex items-center gap-3.5"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div className="text-left flex-1">
                <span className="text-[10px] font-black uppercase text-emerald-700 block mb-0.5">Descarga Exitosa</span>
                <span className="text-[11px] font-semibold text-slate-600 leading-normal block">
                  El boleto de abordaje (boarding_pass_amir_zhen.pdf) se ha guardado en su dispositivo de manera segura.
                </span>
              </div>
              <button onClick={() => setShowPassAlert(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X size={14} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Flights;
