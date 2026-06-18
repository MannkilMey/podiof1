import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { supabase } from '../../lib/supabase';

const CSS = `
.delete-page {
  max-width: 600px; margin: 0 auto; padding: 40px 28px;
  min-height: 100vh; background: var(--bg);
  font-family: 'Barlow', sans-serif;
}
.delete-back {
  background: transparent; border: none; color: var(--red);
  cursor: pointer; font-size: 14px; font-weight: 600;
  margin-bottom: 24px; padding: 0;
}
.delete-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px; font-weight: 900; color: var(--white);
  margin-bottom: 8px;
}
.delete-subtitle {
  font-size: 14px; color: var(--muted); margin-bottom: 32px; line-height: 1.6;
}
.delete-warning {
  background: rgba(232,0,45,0.08); border: 1px solid rgba(232,0,45,0.3);
  border-radius: 12px; padding: 20px; margin-bottom: 24px;
}
.delete-warning-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px; font-weight: 800; color: var(--red);
  margin-bottom: 12px;
}
.delete-warning-list {
  padding-left: 20px; font-size: 14px; color: var(--muted); line-height: 1.8;
}
.delete-confirm-box {
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: 12px; padding: 24px; margin-bottom: 24px;
}
.delete-input {
  width: 100%; padding: 14px 16px; background: var(--bg3);
  border: 2px solid var(--border); border-radius: 10px;
  color: var(--white); font-size: 16px; font-family: 'Barlow', sans-serif;
  text-align: center; margin-top: 12px; box-sizing: border-box;
}
.delete-input:focus { outline: none; border-color: var(--red); }
.delete-btn {
  width: 100%; padding: 16px; border: none; border-radius: 10px;
  font-family: 'Barlow Condensed', sans-serif; font-size: 16px;
  font-weight: 800; letter-spacing: 1px; text-transform: uppercase;
  cursor: pointer; transition: all 0.2s; margin-bottom: 12px;
}
.delete-btn.danger {
  background: var(--red); color: white;
}
.delete-btn.danger:disabled {
  opacity: 0.4; cursor: not-allowed;
}
.delete-btn.cancel {
  background: transparent; border: 2px solid var(--border);
  color: var(--white);
}
.delete-btn.cancel:hover { border-color: var(--border2); }
.delete-success {
  text-align: center; padding: 60px 20px;
}
.delete-success-icon { font-size: 64px; margin-bottom: 20px; }
.delete-success-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 28px; font-weight: 900; color: var(--white);
  margin-bottom: 12px;
}
.delete-success-text { font-size: 14px; color: var(--muted); line-height: 1.6; }
@media (max-width: 768px) {
  .delete-page { padding: 20px 16px; }
  .delete-title { font-size: 26px; }
}
`;

const CONFIRM_TEXT = 'ELIMINAR';

export default function DeleteAccount() {
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  
  const [step, setStep] = useState(1); // 1: info, 2: confirm, 3: done
  const [confirmInput, setConfirmInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (confirmInput !== CONFIRM_TEXT) return;
    setLoading(true);
    setError('');

    try {
      // Call the SQL function that handles all data deletion
      const { error: deleteError } = await supabase
        .rpc('delete_user_account', { p_user_id: user.id });

      if (deleteError) throw deleteError;

      setStep(3);

      // Sign out after 3 seconds
      setTimeout(async () => {
        await signOut();
        navigate('/landing', { replace: true });
      }, 3000);
    } catch (err) {
      console.error('Error deleting account:', err);
      setError(err.message || 'Error al eliminar la cuenta. Intentá de nuevo o contactá a privacy@podiof1.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div data-theme={theme} className="delete-page">
        
        {step === 1 && (
          <>
            <button className="delete-back" onClick={() => navigate(-1)}>← Volver</button>
            <h1 className="delete-title">Eliminar mi Cuenta</h1>
            <div className="delete-subtitle">
              Antes de continuar, por favor leé detenidamente lo que implica eliminar tu cuenta.
            </div>

            <div className="delete-warning">
              <div className="delete-warning-title">⚠️ Esta acción es irreversible</div>
              <ul className="delete-warning-list">
                <li>Tu perfil y datos personales serán eliminados permanentemente</li>
                <li>Serás removido de todos tus grupos</li>
                <li>Tus predicciones serán anonimizadas</li>
                <li>Tus badges y logros se perderán</li>
                <li>No podrás recuperar tu cuenta ni tus datos</li>
                <li>Si sos admin de un grupo, el grupo quedará sin administrador</li>
              </ul>
            </div>

            <button 
              className="delete-btn danger" 
              onClick={() => setStep(2)}
            >
              Entiendo, quiero continuar
            </button>
            <button 
              className="delete-btn cancel" 
              onClick={() => navigate(-1)}
            >
              Cancelar, mantener mi cuenta
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <button className="delete-back" onClick={() => setStep(1)}>← Volver</button>
            <h1 className="delete-title">Confirmar Eliminación</h1>
            <div className="delete-subtitle">
              Para confirmar, escribí <strong style={{ color: 'var(--red)' }}>ELIMINAR</strong> en 
              el campo de abajo.
            </div>

            <div className="delete-confirm-box">
              <div style={{ fontSize: 14, color: 'var(--muted)', textAlign: 'center' }}>
                Cuenta: <strong style={{ color: 'var(--white)' }}>{user?.email}</strong>
              </div>
              <input
                type="text"
                className="delete-input"
                placeholder="Escribí ELIMINAR"
                value={confirmInput}
                onChange={e => setConfirmInput(e.target.value.toUpperCase())}
                autoFocus
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(232,0,45,0.1)', border: '1px solid rgba(232,0,45,0.3)',
                borderRadius: 8, padding: 12, color: 'var(--red)', fontSize: 13,
                marginBottom: 16
              }}>
                {error}
              </div>
            )}

            <button
              className="delete-btn danger"
              disabled={confirmInput !== CONFIRM_TEXT || loading}
              onClick={handleDelete}
            >
              {loading ? 'Eliminando cuenta...' : '🗑️ Eliminar mi cuenta permanentemente'}
            </button>
            <button 
              className="delete-btn cancel" 
              onClick={() => { setStep(1); setConfirmInput(''); }}
            >
              Cancelar
            </button>
          </>
        )}

        {step === 3 && (
          <div className="delete-success">
            <div className="delete-success-icon">👋</div>
            <div className="delete-success-title">Cuenta Eliminada</div>
            <div className="delete-success-text">
              Tu cuenta y todos los datos asociados han sido eliminados. 
              Serás redirigido en unos segundos.
              <br/><br/>
              Si fue un error o necesitás ayuda, contactá a{' '}
              <a href="mailto:privacy@podiof1.com" style={{ color: 'var(--red)' }}>
                privacy@podiof1.com
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}