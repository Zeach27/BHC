import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, faLock, faShieldHalved, faExclamationCircle, faEye, faEyeSlash
} from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setLock] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("adminId", "BHW-2026-SA-001");
      localStorage.setItem("adminName", "Super Administrator");
      navigate("/");
    } else {
      setError("AUTHENTICATION FAILED: INVALID CREDENTIALS");
    }
  };

  return (
    <div className="admin" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      background: 'white',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    }}>
      
      {/* LEFT SIDE: HIGH-IMPACT AUTHORITY PANEL (50% Width) */}
      <aside className="sidebar" style={{ 
          flex: 1, 
          padding: '5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          flexShrink: 0, 
          position: 'relative', 
          overflow: 'hidden',
          background: '#0F172A',
          borderRight: '1px solid rgba(255,255,255,0.05)'
      }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(#4169E1 1.5px, transparent 1.5px)', backgroundSize: '50px 50px' }}></div>
          
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '500px' }}>
              <div className="sidebar__brand" style={{ padding: 0, marginBottom: '4rem', justifyContent: 'center' }}>
                  <div className="sidebar__brand-icon-wrapper" style={{ background: 'linear-gradient(135deg, #4169E1 0%, #3154B3 100%)', color: 'white', width: '72px', height: '72px', borderRadius: '20px', boxShadow: '0 15px 35px rgba(65, 105, 225, 0.4)', fontSize: '2rem' }}>
                      <FontAwesomeIcon icon={faShieldHalved} />
                  </div>
              </div>
              
              <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'white', margin: '0 0 1rem 0', letterSpacing: '-0.04em' }}>CHESMS</h1>
              <div style={{ height: '4px', width: '60px', background: '#4169E1', margin: '0 auto 2.5rem', borderRadius: '2px' }}></div>

              <h2 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-0.03em' }}>
                  Community <br/>
                  <span style={{ color: '#4169E1' }}>Health Hub.</span>
              </h2>
              
              <p style={{ fontSize: '1.25rem', color: '#94A3B8', lineHeight: 1.7, fontWeight: 500, margin: '0 auto', letterSpacing: '0.02em' }}>
                  The unified command center for community health coordination and strategic data management.
              </p>
          </div>
      </aside>

      {/* RIGHT SIDE: MASTER LOGIN CONSOLE (50% Width) */}
      <main className="admin__content" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', background: '#F8FAFC', position: 'relative' }}>
          
          <div className="animate-fade-in" style={{ width: '100%', maxWidth: '420px' }}>
              
              {/* LOGIN CARD */}
              <div className="report-card" 
                style={{ 
                    padding: '4.5rem 3.5rem', 
                    borderRadius: '32px', 
                    border: '1px solid #E2E8F0', 
                    background: 'white', 
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05)',
                    position: 'relative'
                }}
              >
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '8px', background: '#4169E1', borderRadius: '32px 32px 0 0' }}></div>

                  <div style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
                      <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Welcome Back</h1>
                      <p style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 600, marginTop: '8px' }}>Official health authority access node</p>
                  </div>

                  {error && (
                    <div style={{ padding: '1rem', background: '#0F172A', borderRadius: '12px', color: '#F87171', fontSize: '0.7rem', fontWeight: 900, marginBottom: '2.5rem', textAlign: 'center', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
                        <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: '8px' }} />
                        {error}
                    </div>
                  )}

                  <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <div>
                          <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#0F172A', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username</label>
                          <div style={{ position: 'relative' }}>
                              <FontAwesomeIcon icon={faUser} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1', fontSize: '0.875rem' }} />
                              <input 
                                  type="text" 
                                  required 
                                  style={{ width: '100%', padding: '1.125rem 1rem 1.125rem 3.25rem', borderRadius: '16px', border: '1.5px solid #E2E8F0', background: 'white', color: '#0F172A', outline: 'none', fontSize: '1rem', fontWeight: 700, transition: 'all 0.2s' }} 
                                  className="login-input"
                                  onChange={e => setUsername(e.target.value)}
                              />
                          </div>
                      </div>

                      <div>
                          <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#0F172A', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                          <div style={{ position: 'relative' }}>
                              <FontAwesomeIcon icon={faLock} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1', fontSize: '0.875rem' }} />
                              <input 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="••••••••" 
                                  required 
                                  style={{ width: '100%', padding: '1.125rem 3.5rem 1.125rem 3.25rem', borderRadius: '16px', border: '1.5px solid #E2E8F0', background: 'white', color: '#0F172A', outline: 'none', fontSize: '1rem', fontWeight: 700, transition: 'all 0.2s' }} 
                                  className="login-input"
                                  onChange={e => setLock(e.target.value)}
                              />
                              <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '1.1rem' }}
                              >
                                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                              </button>
                          </div>
                      </div>
                      
                      <button type="submit" className="button" style={{ width: '100%', padding: '1.25rem', borderRadius: '18px', fontWeight: 900, fontSize: '1rem', marginTop: '1rem', background: '#4169E1', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 15px 30px -5px rgba(65, 105, 225, 0.4)', transition: 'all 0.3s', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                          LOGIN
                      </button>
                  </form>
              </div>
          </div>

          {/* Minimalist Footer */}
          <div style={{ position: 'absolute', bottom: '2.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  © 2026 CHESMS | Health Authority Management
              </p>
          </div>
      </main>

      <style>{`
        .login-input:focus {
            border-color: #4169E1 !important;
            box-shadow: 0 0 0 4px rgba(65, 105, 225, 0.1) !important;
        }
        .button:hover {
            background: #3154B3 !important;
            transform: translateY(-2px);
            box-shadow: 0 20px 35px -5px rgba(65, 105, 225, 0.5) !important;
        }
        @media (max-width: 992px) {
            .sidebar {
                display: none !important;
            }
        }
      `}</style>
    </div>
  );
}
