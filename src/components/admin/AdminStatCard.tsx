import React, { useEffect, useState } from 'react';
import { IonSpinner } from '@ionic/react';
import { isAxiosError } from 'axios';

interface AdminStatCardProps {
  title: string;
  icon: string;
  unit?: string;
  emptyMessage: string;
  load: () => Promise<{ data: unknown }>;
}

type StatState = { status: 'loading' } | { status: 'success'; count: number } | { status: 'error'; message: string };

export const AdminStatCard: React.FC<AdminStatCardProps> = ({ title, icon, unit, emptyMessage, load }) => {
  const [state, setState] = useState<StatState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });
    void load().then((response) => {
      if (!Array.isArray(response.data)) throw new Error('Format respons statistik tidak sesuai.');
      if (active) setState({ status: 'success', count: response.data.length });
    }).catch((error: unknown) => {
      if (!active) return;
      const unauthorized = isAxiosError(error) && [401, 403].includes(error.response?.status || 0);
      setState({ status: 'error', message: unauthorized ? 'Akses ditolak atau sesi berakhir. Silakan login kembali.' : 'Statistik gagal dimuat. Silakan coba lagi.' });
    });
    return () => { active = false; };
  }, [load, attempt]);

  return (
    <section className="admin-stat-card" aria-label={title} aria-busy={state.status === 'loading'}>
      <span className="admin-stat-card__icon"><img src={icon} alt="" /></span>
      <span className="admin-stat-card__divider" aria-hidden="true"><img src="/assets/admin/stat-divider.svg" alt="" /></span>
      <div className="admin-stat-card__body">
        <h2>{title}</h2>
        <div aria-live="polite">
          {state.status === 'loading' && <p className="admin-stat-card__loading" role="status"><IonSpinner name="crescent" />Memuat…</p>}
          {state.status === 'success' && <>
            <p className="admin-stat-card__value"><strong>{state.count.toLocaleString('id-ID')}</strong>{unit && <span>{unit}</span>}</p>
            {state.count === 0 && <p className="admin-stat-card__empty">{emptyMessage}</p>}
          </>}
          {state.status === 'error' && <div className="admin-stat-card__error">
            <p role="alert">{state.message}</p>
            <button className="admin-button admin-button--outline" type="button" onClick={() => setAttempt((value) => value + 1)} aria-label={`Coba lagi ${title}`}>Coba lagi</button>
          </div>}
        </div>
      </div>
    </section>
  );
};
