import React, { useState } from 'react';
import { IonButton, IonSearchbar } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import './SpeciesSearch.css';

const SpeciesSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const searchName = name.trim();
    if (searchName) {
      navigate(`/search/results?name=${encodeURIComponent(searchName)}`);
    }
  };

  return (
    <MainLayout>
      <section className="species-search-page">
        <h1>Cari Spesies Ikan</h1>
        <form className="species-search-form" onSubmit={handleSearch}>
          <IonSearchbar
            placeholder="Cari nama ikan lokal..."
            animated={true}
            value={name}
            onIonInput={(event) => setName(event.detail.value || '')}
          />
          <IonButton type="submit" disabled={!name.trim()}>Cari</IonButton>
        </form>
      </section>
    </MainLayout>
  );
};

export default SpeciesSearchPage;