import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Leaf, Menu, X, Bell, LogOut, User, Settings, Package } from "lucide-react";
import { useState } from "react";
import Logo from "../assets/logo.png";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Toggle true/false to test
  const [userName] = useState("John Doe");
  const [userRole] = useState("donor"); // "donor" | "recipient" | "admin"

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProfileOpen(false);
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "text-green-600 border-b-2 border-green-600 font-semibold"
      : "text-slate-700 hover:text-green-600";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
      <nav className="container mx-auto px-4  flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-green-600">
          <img src={Logo} className="h-25 w-25" />
          <span>Annapurna Bhandar</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {/* Non-Logged In */}
          {!isLoggedIn && (
            <>
              <Link to="/" className={`text-sm font-medium pb-1 transition-colors ${isActive("/")}`}>Home</Link>
              <Link to="/browse" className={`text-sm font-medium pb-1 transition-colors ${isActive("/browse")}`}>Browse Food</Link>
              <Link to="/about" className={`text-sm font-medium pb-1 transition-colors ${isActive("/about")}`}>About</Link>
              <Link to="/contact" className={`text-sm font-medium pb-1 transition-colors ${isActive("/contact")}`}>Contact</Link>
            </>
          )}

          {/* Donor */}
          {isLoggedIn && userRole === "donor" && (
            <>
              <Link to="/" className={`text-sm font-medium pb-1 transition-colors ${isActive("/")}`}>Home</Link>
              <Link to="/browse" className={`text-sm font-medium pb-1 transition-colors ${isActive("/browse")}`}>Browse Food</Link>
              <Link to="/donation-history" className={`text-sm font-medium pb-1 transition-colors ${isActive("/donation-history")}`}>My Donations</Link>
              <Link to="/donor-dashboard" className={`text-sm font-medium pb-1 transition-colors ${isActive("/donor-dashboard")}`}>Dashboard</Link>
            </>
          )}

          {/* Recipient */}
          {isLoggedIn && userRole === "recipient" && (
            <>
              <Link to="/" className={`text-sm font-medium pb-1 transition-colors ${isActive("/")}`}>Home</Link>
              <Link to="/browse" className={`text-sm font-medium pb-1 transition-colors ${isActive("/browse")}`}>Browse Food</Link>
              <Link to="/request-history" className={`text-sm font-medium pb-1 transition-colors ${isActive("/request-history")}`}>My Requests</Link>
              <Link to="/recipient-dashboard" className={`text-sm font-medium pb-1 transition-colors ${isActive("/recipient-dashboard")}`}>Dashboard</Link>
            </>
          )}

          {/* Admin */}
          {isLoggedIn && userRole === "admin" && (
            <>
              <Link to="/" className={`text-sm font-medium pb-1 transition-colors ${isActive("/")}`}>Home</Link>
              <Link to="/admin" className={`text-sm font-medium pb-1 transition-colors ${isActive("/admin")}`}>Dashboard</Link>
            </>
          )}
        </div>

        {/* Right Section - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* Notifications */}
              <Link to="/notifications">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-600 rounded-full" />
                </Button>
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">{userName}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                    <Link
                      to="/user/d1"
                      className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 first:rounded-t-lg"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="h-4 w-4 inline mr-2" /> View Profile
                    </Link>
                    <Link
                      to="/edit-profile/d1"
                      className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="h-4 w-4 inline mr-2" /> Edit Profile
                    </Link>
                    <Link
                      to={userRole === "donor" ? "/donation-history" : userRole === "recipient" ? "/request-history" : "/admin"}
                      className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 border-t border-slate-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Package className="h-4 w-4 inline mr-2" />
                      {userRole === "donor" ? "Donation History" : userRole === "recipient" ? "Request History" : "Admin Dashboard"}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="sm" className="border-slate-300">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-slate-700"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {/* Mobile Links */}
            {!isLoggedIn && (
              <>
                <Link to="/" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-900 hover:text-green-600">Home</Link>
                <Link to="/browse" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-900 hover:text-green-600">Browse Food</Link>
                <Link to="/about" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-900 hover:text-green-600">About</Link>
                <Link to="/contact" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-900 hover:text-green-600">Contact</Link>
              </>
            )}

            {isLoggedIn && userRole === "donor" && (
              <>
                <Link to="/" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-900 hover:text-green-600">Home</Link>
                <Link to="/browse" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-900 hover:text-green-600">Browse Food</Link>
                <Link to="/donation-history" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-900 hover:text-green-600">My Donations</Link>
                <Link to="/donor-dashboard" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-900 hover:text-green-600">Dashboard</Link>
              </>
            )}

            {isLoggedIn && userRole === "recipient" && (
              <>
                <Link to="/" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-900 hover:text-green-600">Home</Link>
                <Link to="/browse" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-900 hover:text-green-600">Browse Food</Link>
                <Link to="/request-history" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-900 hover:text-green-600">My Requests</Link>
                <Link to="/recipient-dashboard" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-900 hover:text-green-600">Dashboard</Link>
              </>
            )}

            {isLoggedIn && userRole === "admin" && (
              <>
                <Link to="/" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-900 hover:text-green-600">Home</Link>
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-900 hover:text-green-600">Dashboard</Link>
              </>
            )}

            {isLoggedIn && (
              <>
                <div className="border-t border-slate-200 my-4" />
                <Link to="/notifications" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium text-slate-900 hover:text-green-600">
                  <Bell className="h-5 w-5" /> Notifications
                </Link>
                <Link to="/user/d1" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium text-slate-900 hover:text-green-600">
                  <User className="h-5 w-5" /> View Profile
                </Link>
                <Link to="/edit-profile/d1" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium text-slate-900 hover:text-green-600">
                  <Settings className="h-5 w-5" /> Edit Profile
                </Link>
              </>
            )}

            <div className="border-t border-slate-200 pt-4 space-y-3">
              {isLoggedIn ? (
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full text-left flex items-center gap-3 px-3 py-3 text-lg font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="h-5 w-5" /> Logout
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block">
                    <Button variant="outline" size="lg" className="w-full border-slate-300">Sign In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="block">
                    <Button size="lg" className="w-full bg-green-600 text-white hover:bg-green-700">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}