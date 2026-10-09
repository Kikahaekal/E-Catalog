import React, { useEffect, useState } from 'react';
import { IonSpinner, IonText } from '@ionic/react';
import { Link, useSearchParams } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { getAllSpecies, Species } from '../services/species';
import './SpeciesSearch.css';

const SpeciesSearchResultsPage: React.FC = () => {
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
          <IonText color="medium">Kata kunci pencarian tidak ditemukan.</IonText>
        ) : species.length === 0 ? (
          <IonText color="medium">Tidak ada spesies yang cocok dengan pencarian ini.</IonText>
        ) : (
          <div className="species-results-table-wrapper">
            <table className="species-results-table">
              <thead>
                <tr>
                  <th scope="col">Nama ikan</th>
                  <th scope="col">Nama ilmiah</th>
                  <th scope="col">Nama lokal</th>
                  <th scope="col">Detail</th>
                </tr>
              </thead>
              <tbody>
                {species.map((item) => (
                  <tr key={item.id}>
                    <td>{item.commonName}</td>
                    <td><em>{item.scientificName}</em></td>
                    <td>
                      {item.localNames?.map((localName: any) =>
                        localName.name || localName.submittedName ||
                        (typeof localName.localName === 'string' ? localName.localName : localName.localName?.name)
                      ).filter(Boolean).join(', ') || '—'}
                    </td>
                    <td>
                      <Link to={`/species/${item.id}?name=${encodeURIComponent(name)}`}>Lihat</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default SpeciesSearchResultsPage;