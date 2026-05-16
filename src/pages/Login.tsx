import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-academic-50 rounded-2xl mb-4">
              <CheckCircle2 size={32} className="text-academic-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Bienvenido</h2>
            <p className="text-slate-500 mt-2">Accede a tu portal docente</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block ml-1">
                Correo Institucional
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={20} className="text-slate-300 group-focus-within:text-academic-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-academic-500 text-slate-700 transition-all font-medium"
                  placeholder="nombre@institucion.edu"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block ml-1">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className="text-slate-300 group-focus-within:text-academic-500 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-academic-500 text-slate-700 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-academic-600 focus:ring-academic-500" />
                <span className="text-sm text-slate-500 font-medium">Recordarme</span>
              </label>
              <button type="button" className="text-sm font-semibold text-academic-600 hover:text-academic-700">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-academic-600 hover:bg-academic-700 text-white rounded-2xl font-bold shadow-lg shadow-academic-600/20 transform transition active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              Iniciar Sesión
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm">
            Diseñado para docentes profesionales
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
