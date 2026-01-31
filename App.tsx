import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  ChevronRight, 
  Star, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Instagram, 
  Phone,
  UtensilsCrossed,
  ChefHat,
  Coffee,
  Wine,
  ArrowRight,
  Menu,
  X,
  Quote,
  CheckCircle2,
  AlertCircle,
  Lock
} from 'lucide-react';
import { Reservation, AppView } from './types';
import AdminDashboard from './components/AdminDashboard';
import { fetchReservations, createReservation, updateReservationStatusService, checkConnection } from './services/supabase';

// --- Data: Menu Items (25 Items) ---
const CATEGORIES = [
  { id: 'destaques', label: '', icon: Star },
  { id: 'carnes', label: 'Carnes Nobres', icon: UtensilsCrossed },
  { id: 'massas', label: 'Massas Artesanais', icon: ChefHat },
  { id: 'entradas', label: 'Entradas', icon: Coffee }, 
  { id: 'sobremesas', label: 'Sobremesas', icon: Star },
  { id: 'vinhos', label: 'Vinhos & Drinks', icon: Wine },
];

const TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"
];

const MENU_ITEMS = [
  // Carnes / Destaques
  {
    id: 1,
    name: "Prime Tomahawk Gold",
    description: "Corte nobre de 800g com osso, finalizado na manteiga de ervas e flor de sal.",
    price: 189.90,
    category: "carnes",
    highlight: true,
    image: "https://images.unsplash.com/photo-1615937691194-97dbd3f3dc29?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    name: "Bife de Chorizo Angus",
    description: "Suculência extrema, grelhado ao ponto do chef. Acompanha batatas rústicas.",
    price: 89.90,
    category: "carnes",
    highlight: true,
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    name: "Costela Defumada BBQ",
    description: "Assada lentamente por 12 horas, desmancha no garfo. Molho barbecue artesanal.",
    price: 75.00,
    category: "carnes",
    highlight: false,
    image: "https://img.freepik.com/fotos-premium/costelinha-de-porco-estilo-americano-deliciosas-costelinhas-de-porco-defumadas-com-cobertura-de-molho-barbecue-vista-de-cima_946881-13.jpg"
  },
  {
    id: 4,
    name: "Ancho Premium",
    description: "Corte dianteiro do contrafilé, marmoreio intenso e sabor inigualável.",
    price: 92.00,
    category: "carnes",
    highlight: false,
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=800"
  },
  // Massas
  {
    id: 5,
    name: "Gnocchi ao Funghi Trufado",
    description: "Massa fresca de batata, molho cremoso de cogumelos selvagens e azeite trufado.",
    price: 68.00,
    category: "massas",
    highlight: true,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    name: "Carbonara Autêntica",
    description: "Sem creme de leite. Gema caipira, pecorino romano, guanciale e pimenta negra.",
    price: 62.00,
    category: "massas",
    highlight: true,
    image: "https://images.unsplash.com/photo-1588013273468-315fd88ea34c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 7,
    name: "Risoto de Camarão",
    description: "Arroz arbóreo, camarões rosa grandes, limão siciliano e parmesão.",
    price: 79.00,
    category: "massas",
    highlight: false,
    image: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 8,
    name: "Lasagna Bolognese",
    description: "Camadas finas de massa, ragu de carne cozido por 6h e molho bechamel.",
    price: 58.00,
    category: "massas",
    highlight: false,
    image: "https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&q=80&w=800"
  },
  // Entradas
  {
    id: 9,
    name: "Burrata Caprese",
    description: "Burrata cremosa, tomates confit, pesto de manjericão fresco e torradas.",
    price: 55.00,
    category: "entradas",
    highlight: true,
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 10,
    name: "Carpaccio Clássico",
    description: "Lâminas finíssimas de carne crua, alcaparras, parmesão e mostarda.",
    price: 48.00,
    category: "entradas",
    highlight: false,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 11,
    name: "Bruschetta Pomodoro",
    description: "Pão italiano tostado, tomates frescos, alho e manjericão.",
    price: 32.00,
    category: "entradas",
    highlight: false,
    image: "https://trattorialapasta.com/cms-data/blog/menu/bruschetta-al-pomodoro/image/bruschetta-al-pomodoro.jpg"
  },
  {
    id: 12,
    name: "Dadinhos de Queijo Coalho",
    description: "Crocantes por fora, macios por dentro. Acompanha geleia de pimenta.",
    price: 35.00,
    category: "entradas",
    highlight: false,
    image: "https://images.unsplash.com/photo-1548340748-6d2b7d7da280?auto=format&fit=crop&q=80&w=800"
  },
  // Sobremesas
  {
    id: 13,
    name: "Volcán de Dulce de Leche",
    description: "Petit gateau de doce de leite argentino com sorvete de baunilha.",
    price: 32.00,
    category: "sobremesas",
    highlight: true,
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 14,
    name: "Tiramisu Fuego",
    description: "A clássica receita italiana com um toque de conhaque.",
    price: 28.00,
    category: "sobremesas",
    highlight: false,
    image: "https://desxestal.com/wp-content/uploads/2021/04/desxestal_tiramisu-scaled.jpg"
  },
  {
    id: 15,
    name: "Cheesecake de Frutas Vermelhas",
    description: "Base crocante, creme suave e calda rústica de frutas.",
    price: 29.00,
    category: "sobremesas",
    highlight: false,
    image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&q=80&w=800"
  },
  // Vinhos
  {
    id: 16,
    name: "Malbec Reserva",
    description: "Vinho tinto encorpado, notas de ameixa e baunilha. Safra especial.",
    price: 140.00,
    category: "vinhos",
    highlight: false,
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 17,
    name: "Fuego Signature Drink",
    description: "Gin, infusão de hibisco, tônica e defumação de alecrim.",
    price: 38.00,
    category: "vinhos",
    highlight: true,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800"
  }
];

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('destaques');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('public');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Professional Access State
  const [logoClicks, setLogoClicks] = useState(0);

  // Custom Toast State
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  
  // System Status
  const [isDbConnected, setIsDbConnected] = useState(true);

  // Show Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };
  
  // State for Reservations - REAL DATABASE DATA
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);

  // Fetch from Supabase on Load
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingReservations(true);
      try {
        const isConnected = await checkConnection();
        setIsDbConnected(isConnected);
        
        const data = await fetchReservations();
        setReservations(data);
      } catch (error) {
        console.error("Failed to load reservations", error);
        setIsDbConnected(false);
      } finally {
        setIsLoadingReservations(false);
      }
    };
    loadData();
  }, [currentView]); // Reload when view changes (e.g. logging into admin)

  // --- PROFESSIONAL ACCESS METHODS ---
  // 1. URL Hash Access (e.g., website.com/#admin)
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setShowLoginModal(true);
        // Clear hash to preserve clean URL
        window.history.replaceState(null, '', window.location.pathname);
      }
    };
    checkHash(); // Check on load
    window.addEventListener('hashchange', checkHash); // Check on change
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // 2. Secret Gesture Timeout Reset
  useEffect(() => {
    if (logoClicks > 0) {
      const timer = setTimeout(() => setLogoClicks(0), 1500); // Reset clicks if not fast enough
      return () => clearTimeout(timer);
    }
  }, [logoClicks]);

  // Public Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '20:00',
    pax: '2 Pessoas',
    tableType: 'Salão Principal'
  });

  // Phone Masking Logic
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length > 11) value = value.slice(0, 11);
    
    // Apply Mask (XX) XXXXX-XXXX
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 10) {
      value = `${value.slice(0, 10)}-${value.slice(10)}`;
    }
    setFormData({...formData, phone: value});
  };

  const filteredItems = activeCategory === 'destaques' 
    ? MENU_ITEMS.filter(item => item.highlight)
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.phone) {
      showToast("Por favor, preencha todos os campos obrigatórios.", "error");
      return;
    }

    try {
      showToast("Enviando solicitação...", "info");
      
      const newReservation = await createReservation({
        clientName: formData.name,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        pax: formData.pax,
        tableType: formData.tableType
      });

      if (newReservation) {
        setReservations(prev => [newReservation, ...prev]);
        showToast("Solicitação enviada com sucesso! Aguarde a confirmação.");
        setFormData({ ...formData, name: '', phone: '', date: '' });
      }
    } catch (error) {
      showToast("Erro ao conectar com o servidor. Tente novamente.", "error");
    }
  };

  const updateReservationStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      await updateReservationStatusService(id, status);
      // Update local state to reflect change immediately
      setReservations(prev => prev.map(res => 
        res.id === id ? { ...res, status } : res
      ));
      showToast(`Reserva ${status === 'confirmed' ? 'confirmada' : 'cancelada'} com sucesso.`);
    } catch (error) {
      showToast("Erro ao atualizar status.", "error");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const SECRET_KEY = "uvicvtyicJYcIYCRCJFCDYRXJfjcukvkhjVUTFT678526G7RF7VB78R7VI FVr%*6RV56RFGFvghccv u+_-=_=-+_=-+----__--_--_--_--hfnfnfnlIlIlIlIlIlIlIlIlIlIlIlI*j*bkgv9 675e8b2794t7*****y34rg4g7578r7547t5rtgfrfruffg***************************************************************************************************************************************************************************************************************************************************************************************************";
    
    if (loginPassword === SECRET_KEY) {
      setShowLoginModal(false);
      setLoginError('');
      setLoginPassword('');
      setCurrentView('admin');
      showToast("Bem-vindo ao sistema de gestão.", 'info');
    } else {
      setLoginError("Senha incorreta.");
    }
  };

  // Handler for Secret Logo Click
  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount === 20) {
      setShowLoginModal(true);
      setLogoClicks(0);
    }
  };

  // --- ADMIN VIEW ---
  if (currentView === 'admin') {
    return (
      <>
        <AdminDashboard 
          reservations={reservations} 
          onUpdateStatus={updateReservationStatus} 
          onLogout={() => setCurrentView('public')} 
          menuItems={MENU_ITEMS as any}
          isDbConnected={isDbConnected}
        />
        {/* Toast Container */}
        <div className={`fixed top-4 right-4 z-[100] transition-all duration-300 transform ${toast ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0 pointer-events-none'}`}>
          {toast && (
            <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md ${toast.type === 'error' ? 'bg-red-900/90 border-red-500/50 text-white' : toast.type === 'info' ? 'bg-blue-900/90 border-blue-500/50 text-white' : 'bg-stone-900/90 border-emerald-500/50 text-white'}`}>
              {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} className="text-emerald-400" />}
              <p className="font-medium text-sm">{toast.message}</p>
            </div>
          )}
        </div>
      </>
    );
  }

  // --- PUBLIC VIEW ---
  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-sans selection:bg-orange-600 selection:text-white pb-20">
      
      {/* TOAST NOTIFICATION */}
      <div className={`fixed top-24 right-4 z-[100] transition-all duration-300 transform ${toast ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0 pointer-events-none'}`}>
        {toast && (
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md ${toast.type === 'error' ? 'bg-red-900/90 border-red-500/50 text-white' : 'bg-stone-900/90 border-emerald-500/50 text-white'}`}>
             {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} className="text-emerald-400" />}
             <p className="font-medium text-sm">{toast.message}</p>
          </div>
        )}
      </div>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-stone-500 hover:text-white">
              <X size={20} />
            </button>
            <div className="flex flex-col items-center mb-6">
              <div className="bg-stone-800 p-4 rounded-full mb-4">
                <Lock size={24} className="text-orange-500" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">Acesso Gerencial</h3>
              <p className="text-stone-500 text-sm mt-1">Digite sua credencial de administrador</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input 
                  type="password" 
                  autoFocus
                  placeholder="Senha de acesso" 
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none transition-all"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                {loginError && <p className="text-red-500 text-xs mt-2">{loginError}</p>}
              </div>
              <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-all">
                Entrar no Sistema
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* 1. NAVBAR */}
      <nav className="fixed w-full z-50 transition-all duration-300 bg-stone-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 group cursor-pointer z-50 select-none"
            onClick={handleLogoClick}
            title={logoClicks > 0 ? `${20 - logoClicks} to admin` : ''}
          >
            <div className="relative">
               <div className="absolute inset-0 bg-orange-600 blur-lg opacity-50 group-hover:opacity-80 transition-opacity rounded-full"></div>
               <Flame className={`text-orange-500 relative z-10 transition-transform ${logoClicks > 0 ? 'scale-110' : ''}`} size={28} fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-widest text-white leading-none">FUEGO</span>
              <span className="text-[0.6rem] uppercase tracking-[0.3em] text-orange-500 font-medium">Prime Steakhouse</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 text-sm font-medium tracking-wider text-stone-400">
            <a href="#menu" className="hover:text-white transition-colors">CARDÁPIO</a>
            <a href="#reservas" className="hover:text-white transition-colors">RESERVAS</a>
            <a href="#experience" className="hover:text-white transition-colors">EXPERIÊNCIA</a>
          </div>

          <button onClick={() => { document.getElementById('reservas')?.scrollIntoView({ behavior: 'smooth' }) }} className="hidden md:block bg-orange-600 text-white px-6 py-2 rounded-full text-xs font-bold tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-900/20">
            RESERVAR
          </button>

          {/* Mobile Menu Toggle */}
          <button onClick={toggleMobileMenu} className="md:hidden text-white z-50 hover:text-orange-500 transition-colors">
             {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation Overlay - Replaced with Brown Card Layout */}
        <div className={`
          fixed inset-0 z-40 flex justify-center items-start pt-32 transition-all duration-300
          ${mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}
          md:hidden
        `}>
           {/* Dark Backdrop */}
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={toggleMobileMenu}></div>

           {/* Brown Menu Card */}
           <div className={`
             relative z-50 bg-stone-800 border border-orange-900/30 w-[85%] max-w-sm rounded-2xl p-8 flex flex-col items-center gap-6 shadow-2xl shadow-black transform transition-all duration-300
             ${mobileMenuOpen ? 'translate-y-0 scale-100' : '-translate-y-10 scale-95'}
           `}>
               <a href="#menu" onClick={toggleMobileMenu} className="text-xl font-serif font-bold text-white hover:text-orange-500 transition-colors w-full text-center border-b border-white/5 pb-4">
                 CARDÁPIO
               </a>
               <a href="#reservas" onClick={toggleMobileMenu} className="text-xl font-serif font-bold text-white hover:text-orange-500 transition-colors w-full text-center border-b border-white/5 pb-4">
                 RESERVAS
               </a>
               <a href="#experience" onClick={toggleMobileMenu} className="text-xl font-serif font-bold text-white hover:text-orange-500 transition-colors w-full text-center pb-2">
                 EXPERIÊNCIA
               </a>
               <button onClick={toggleMobileMenu} className="w-full bg-orange-600 text-white py-3 rounded-full text-sm font-bold tracking-widest mt-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-900/20">
                 FAZER RESERVA
               </button>
           </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax-like fix */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=2560"
            alt="Steak Background"
            className="w-full h-full object-cover opacity-60 scale-105 animate-pulse-slow" 
            style={{ animationDuration: '20s' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0c0a09_100%)]"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4 mt-16 animate-in slide-in-from-bottom-10 fade-in duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Star size={12} fill="currentColor" />
            Gastronomia Premiada
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-tight">
            O sabor que <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">incendeia</span> os sentidos.
          </h1>
          <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            No Fuego Prime, unimos a precisão técnica da alta gastronomia com a intensidade do fogo. Uma experiência inesquecível a cada prato.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#menu" className="group bg-white text-stone-950 px-8 py-4 rounded-none border border-white font-bold tracking-wider hover:bg-stone-200 transition-all flex items-center justify-center gap-2">
              VER CARDÁPIO
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#reservas" className="group px-8 py-4 rounded-none border border-white/30 text-white font-bold tracking-wider hover:bg-white/10 transition-all backdrop-blur-sm">
              RESERVAR MESA
            </a>
          </div>
        </div>
      </header>

      {/* NEW SECTION: INFO BAR */}
      <div className="relative z-20 bg-stone-100 border-b-4 border-orange-600 text-stone-900 py-12 shadow-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-around items-center gap-8 text-center md:text-left">
            
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5 group