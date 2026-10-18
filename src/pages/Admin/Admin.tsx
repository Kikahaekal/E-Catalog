import React from 'react';
import { AdminLayout } from '../../layout/AdminLayout';
import { AdminStatCard } from '../../components/admin/AdminStatCard';
import { getAllSpecies } from '../../services/species';
import { getAllFishSubmissions } from '../../services/fish';
import './Admin.css';

const AdminPage: React.FC = () => (
  <AdminLayout>
    <div className="admin-dashboard">
      <p className="admin-dashboard__intro">Selamat Datang! Berikut adalah ringkasan data saat ini.</p>
      <div className="admin-dashboard__stats">
        <AdminStatCard title="Jumlah Spesies Terdaftar" icon="/assets/admin/fish.svg" unit="Spesies" emptyMessage="Belum ada spesies terdaftar." load={getAllSpecies} />
        <AdminStatCard title="Jumlah Usulan Masuk" icon="/assets/admin/notepad.svg" emptyMessage="Belum ada usulan menunggu moderasi." load={getAllFishSubmissions} />
      </div>
      <p className="admin-dashboard__note">Usulan masuk menampilkan usulan yang masih tersimpan dan menunggu moderasi.</p>
    </div>
  </AdminLayout>
);

export default AdminPage;
