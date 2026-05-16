import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, AlertCircle, X, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { format, isBefore, parseISO, startOfDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const NotificationManager: React.FC = () => {
  const { bitacoras, attendanceRecords, notifications, setNotifications } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for "forgotten" sessions
    const today = startOfDay(new Date());
    const pendingNotifications: any[] = [];

    bitacoras.forEach(b => {
      b.calendar?.forEach((session: any) => {
        const sessionDate = parseISO(session.fecha);
        const sessionRecordId = `${b.id}-${session.id}`;
        
        // If session was BEFORE today (or is today and it's late) AND no attendance record exists
        const hasRecord = attendanceRecords.some(r => r.id === sessionRecordId);
        
        if (isBefore(sessionDate, today) && !hasRecord) {
          const notifId = `pending-${sessionRecordId}`;
          if (!notifications.some(n => n.id === notifId)) {
            pendingNotifications.push({
              id: notifId,
              type: 'warning',
              title: 'Asistencia Pendiente',
              message: `Olvidaste registrar la asistencia para ${b.moduloNombre} del día ${session.fecha.split(',')[0]}`,
              data: { bitacoraId: b.id, sessionId: session.id },
              createdAt: new Date().toISOString()
            });
          }
        }
      });
    });

    if (pendingNotifications.length > 0) {
      setNotifications(prev => [...prev, ...pendingNotifications]);
    }
  }, [bitacoras, attendanceRecords]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-4 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {notifications.slice(0, 3).map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl flex gap-4 items-start pointer-events-auto border border-white/10"
          >
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/30">
              <AlertCircle size={24} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{n.title}</span>
                <button onClick={() => removeNotification(n.id)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>
              <p className="text-xs font-bold leading-snug">{n.message}</p>
              <button 
                onClick={() => {
                  navigate('/attendance');
                  removeNotification(n.id);
                }}
                className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-amber-500 uppercase tracking-widest hover:text-white transition-colors"
              >
                Registrar Ahora
                <ChevronRight size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationManager;
