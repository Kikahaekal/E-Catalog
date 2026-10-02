import React, { useEffect, useState } from 'react';
import { IonItem, IonLabel, IonList, IonSpinner, IonText } from '@ionic/react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { getAllSpecies, Species } from '../services/species';
import './SpeciesSearch.css';

const SpeciesSearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name')?.trim() || '';
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!name) {
      setSpecies([]);
      setLoading(false);
      setError('');
      return;
    }

    let active = true;
    setLoading(true);
    setError('');
    getAllSpecies(name)
      .then((response) => {
        if (active) setSpecies(response.data || []);
      })
      .catch((requestError: any) => {
        if (active) {
          setError(requestError.response?.data?.error || 'Gagal memuat hasil pencarian.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [name]);

  return (
    <MainLayout>
      <section className="species-search-page">
        <h1>Hasil Pencarian</h1>
        {name && <p className="species-search-query">Pencarian: <strong>{name}</strong></p>}

        {loading ? (
          <div className="species-search-message">
            <IonSpinner name="crescent" />
            <IonText color="medium">Memuat hasil...</IonText>
          </div>
        ) : error ? (
          <IonText color="danger">{error}</IonText>
        ) : !name ? (
          <IonText color="medium">Masukkan nama ikan pada kolom pencarian.</IonText>
        ) : species.length === 0 ? (
          <IonText color="medium">Tidak ada spesies yang cocok dengan pencarian ini.</IonText>
        ) : (
          <IonList className="species-search-list">
            {species.map((item) => (
              <IonItem
                key={item.id}
                button
                detail
                routerLink={`/species/${item.id}?name=${encodeURIComponent(name)}`}
                className="species-search-result"
              >
                <IonLabel>
                  <h2>{item.commonName}</h2>
                  <p><em>{item.scientificName}</em></p>
                  {!!item.localNames?.length && (
                    <p>Nama lokal: {item.localNames.map((localName: any) => localName.name).filter(Boolean).join(', ')}</p>
                  )}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </section>
    </MainLayout>
  );
};

export default SpeciesSearchPage;
