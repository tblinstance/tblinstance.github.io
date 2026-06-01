import { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  token: string | null;
  showAlert: (title: string, msg: string) => void;
}

const API_BASE = import.meta.env.VITE_API_BASE;

export function SystemSettingsPage({ token, showAlert }: Props) {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/settings/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(res.data);
    } catch {
      showAlert('Error', 'Failed to fetch system settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (key: string, value: string) => {
    try {
      await axios.post(`${API_BASE}/settings/update/`, { key, value }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showAlert('Success', `Setting ${key} updated successfully.`);
      fetchSettings();
    } catch {
      showAlert('Error', 'Failed to update setting.');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [token]);

  if (loading) return <div className="py-10 text-center"><span className="icon animate-spin">sync</span></div>;

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-black m-0 tracking-tight flex items-center gap-3 text-[var(--text-main)]">
          <span className="icon text-[var(--primary)] text-4xl">settings_applications</span>
          System Configuration
        </h2>
        <p className="text-[var(--text-muted)] mt-1 font-medium">Manage global platform parameters and integration keys.</p>
      </div>

      <div className="grid gap-6">
        {settings.map(s => (
          <div key={s.id} className="card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-[var(--primary-transparent-border)] transition-all">
            <div className="flex-1">
              <div className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest mb-1">{s.key}</div>
              <div className="text-lg font-black text-[var(--text-main)] mb-1">{s.value}</div>
              <div className="text-sm text-[var(--text-muted)] font-medium">{s.description || 'No description provided.'}</div>
            </div>
            <button 
              onClick={() => {
                const newVal = window.prompt(`Enter new value for ${s.key}:`, s.value);
                if (newVal !== null && newVal !== s.value) {
                  handleUpdate(s.key, newVal);
                }
              }}
              className="btn btn-secondary btn-sm px-6 border-[var(--border)] group-hover:border-[var(--primary)] group-hover:text-[var(--primary)] transition-all"
            >
              Update
            </button>
          </div>
        ))}
      </div>

      {settings.length === 0 && (
        <div className="card py-20 text-center bg-[var(--surface-2)]">
          <span className="icon text-5xl text-[var(--text-muted)] opacity-20 mb-4">settings</span>
          <p className="text-[var(--text-muted)] font-medium m-0">No system settings found in database.</p>
        </div>
      )}
    </div>
  );
}
