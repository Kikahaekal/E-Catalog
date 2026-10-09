import React, { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { IonImg, IonSpinner, IonText } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { apiClient } from '../services/api';
import { getSpecies, Species, SpeciesLocalName, SpeciesPhoto } from '../services/species';
import './SpeciesDetail.css';

const getPhotoUrl = (photo: SpeciesPhoto | string): string | undefined => {
  const filePath = typeof photo === 'string'
    ? photo
    : photo.filePath || photo.url || photo.imageUrl || photo.photoUrl || photo.path || photo.src;
  if (!filePath || /^(https?:|data:|blob:)/i.test(filePath)) return filePath;

  const baseUrl = apiClient.defaults.baseURL?.replace(/\/+$/, '') || '';
  return `${baseUrl}/${filePath.replace(/\\/g, '/').replace(/^\/+/, '')}`;
};

const getLocalName = (localName: SpeciesLocalName | string): string | undefined => {
  if (typeof localName === 'string') return localName;
  const nestedLocalName = localName.localName;
  const nestedName = typeof nestedLocalName === 'string' ? nestedLocalName : nestedLocalName?.name;
  return localName.name || nestedName || localName.submittedName;
};

const formatValue = (value: string | number | null | undefined): string =>
  value === null || value === undefined || value === '' ? '-' : String(value);

const SpeciesDetailPage: React.FC = () => {
  const { speciesId } = useParams<{ speciesId: string }>();
  const [species, setSpecies] = useState<Species | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!speciesId) return;

    let active = true;
    setLoading(true);
    setError('');
    getSpecies(speciesId)
      .then((response) => {
        if (active) setSpecies(response.data);
      })
      .catch((requestError: unknown) => {
        if (active) {
          const message = isAxiosError<{ error?: string }>(requestError)
            ? requestError.response?.data?.error
            : undefined;
          setError(message || 'Gagal memuat detail spesies.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [speciesId]);

  return (
    <MainLayout>
      <article className="species-detail-page">
        {loading ? (
          <div className="species-detail-message">
            <IonSpinner name="crescent" />
            <IonText color="medium">Memuat detail spesies...</IonText>
          </div>
        ) : error ? (
          <IonText color="danger">{error}</IonText>
        ) : !species ? (
          <IonText color="medium">Data spesies tidak ditemukan.</IonText>
        ) : (
          <>
            <header className="species-detail-heading">
              <h1>{species.commonName}</h1>
              <p><em>{species.scientificName}</em></p>
            </header>

            <section className="species-detail-section">
              <h2>Metadata</h2>
              <dl className="species-detail-fields">
                <div><dt>ID Spesies</dt><dd>{formatValue(species.id)}</dd></div>
                <div><dt>Dibuat</dt><dd>{formatValue(species.createdAt)}</dd></div>
                <div><dt>Diperbarui</dt><dd>{formatValue(species.updatedAt)}</dd></div>
              </dl>
            </section>

            <section className="species-detail-section">
              <h2>Identitas Taksonomi</h2>
              <dl className="species-detail-fields">
                <div><dt>Author</dt><dd>{formatValue(species.author)}</dd></div>
                <div><dt>Etimologi</dt><dd>{formatValue(species.etymology)}</dd></div>
                <div><dt>Ordo</dt><dd>{formatValue(species.order)}</dd></div>
                <div><dt>Famili</dt><dd>{formatValue(species.family)}</dd></div>
                <div><dt>Genus</dt><dd>{formatValue(species.genus)}</dd></div>
              </dl>
            </section>

            <section className="species-detail-section">
              <h2>Habitat dan Distribusi</h2>
              <dl className="species-detail-fields">
                <div><dt>Lingkungan</dt><dd>{formatValue(species.environment)}</dd></div>
                <div><dt>Zona iklim</dt><dd>{formatValue(species.climateZone)}</dd></div>
                <div><dt>Kedalaman (m)</dt><dd>{formatValue(species.depthMinMeters)} - {formatValue(species.depthMaxMeters)}</dd></div>
                <div><dt>Suhu (°C)</dt><dd>{formatValue(species.tempMinC)} - {formatValue(species.tempMaxC)}</dd></div>
                <div className="species-detail-field-wide"><dt>Distribusi</dt><dd>{formatValue(species.distributionText)}</dd></div>
              </dl>
            </section>

            <section className="species-detail-section">
              <h2>Karakteristik</h2>
              <dl className="species-detail-fields">
                <div><dt>Panjang maksimum (cm)</dt><dd>{formatValue(species.maxLengthCm)}</dd></div>
                <div><dt>Tipe panjang</dt><dd>{formatValue(species.lengthType)}</dd></div>
                <div><dt>Berat maksimum (kg)</dt><dd>{formatValue(species.maxWeightKg)}</dd></div>
                <div><dt>Umur maksimum (tahun)</dt><dd>{formatValue(species.maxAgeYears)}</dd></div>
                <div><dt>Duri sirip punggung</dt><dd>{formatValue(species.dorsalSpines)}</dd></div>
                <div><dt>Jari lunak sirip punggung</dt><dd>{formatValue(species.dorsalSoftRays)}</dd></div>
                <div><dt>Duri sirip anal</dt><dd>{formatValue(species.analSpines)}</dd></div>
                <div><dt>Jari lunak sirip anal</dt><dd>{formatValue(species.analSoftRays)}</dd></div>
                <div><dt>Bentuk tubuh</dt><dd>{formatValue(species.bodyShape)}</dd></div>
                <div className="species-detail-field-wide"><dt>Morfologi</dt><dd>{formatValue(species.morphologyText)}</dd></div>
                <div className="species-detail-field-wide"><dt>Biologi</dt><dd>{formatValue(species.biologyText)}</dd></div>
                <div className="species-detail-field-wide"><dt>Fekunditas</dt><dd>{formatValue(species.fecundityText)}</dd></div>
                <div className="species-detail-field-wide"><dt>Ancaman bagi manusia</dt><dd>{formatValue(species.threatToHumans)}</dd></div>
                <div className="species-detail-field-wide"><dt>Kepentingan perikanan</dt><dd>{formatValue(species.fisheriesImportance)}</dd></div>
                <div><dt>Gamefish</dt><dd>{species.isGamefish ? 'Ya' : 'Tidak'}</dd></div>
              </dl>
            </section>

            <section className="species-detail-section">
              <h2>Status Konservasi</h2>
              <dl className="species-detail-fields">
                <div><dt>IUCN</dt><dd>{species.iucnStatus?.code || formatValue(species.iucnStatusId)}{species.iucnStatus?.name ? ` - ${species.iucnStatus.name}` : ''}</dd></div>
                <div><dt>Tanggal penilaian IUCN</dt><dd>{formatValue(species.iucnAssessedAt)}</dd></div>
                <div><dt>CITES</dt><dd>{formatValue(species.citesStatus)}</dd></div>
                <div><dt>CMS</dt><dd>{formatValue(species.cmsStatus)}</dd></div>
              </dl>
            </section>

            <section className="species-detail-section">
              <h2>Sinonim</h2>
              {species.synonyms?.length ? (
                <ul>
                  {species.synonyms.map((synonym, index) => (
                    <li key={`${synonym.scientificName}-${index}`}>
                      <em>{synonym.scientificName}</em>
                      {synonym.author ? `, ${synonym.author}` : ''}
                      {synonym.status ? ` (${synonym.status})` : ''}
                    </li>
                  ))}
                </ul>
              ) : <p>Belum ada sinonim.</p>}
            </section>

            <section className="species-detail-section">
              <h2>Nama Lokal</h2>
              {species.localNames?.length ? (
                <ul>
                  {species.localNames.map((localName, index) => (
                    <li key={localName.id || `${getLocalName(localName) || 'local-name'}-${index}`}>
                      {getLocalName(localName) || '-'}
                      {localName.regionNote ? ` - ${localName.regionNote}` : ''}
                    </li>
                  ))}
                </ul>
              ) : <p>Belum ada nama lokal.</p>}
            </section>

            <section className="species-detail-section">
              <h2>Wilayah Kabupaten/Kota</h2>
              {species.regencies?.length ? (
                <ul>
                  {species.regencies.map((entry, index) => (
                    <li key={entry.regency?.id || `${entry.regency?.name}-${index}`}>
                      {entry.regency?.name || '-'}
                      {entry.regency?.province ? `, ${entry.regency.province}` : ''}
                    </li>
                  ))}
                </ul>
              ) : <p>Belum ada data wilayah.</p>}
            </section>

            <section className="species-detail-section">
              <h2>Zona WPP</h2>
              {species.wppZones?.length ? (
                <ul>
                  {species.wppZones.map((entry, index) => (
                    <li key={entry.wppZone?.id || `${entry.wppZone?.code}-${index}`}>
                      {entry.wppZone?.code || '-'}
                      {entry.wppZone?.description ? `: ${entry.wppZone.description}` : ''}
                    </li>
                  ))}
                </ul>
              ) : <p>Belum ada data zona WPP.</p>}
            </section>

            <section className="species-detail-section">
              <h2>Referensi</h2>
              {species.references?.length ? (
                <ul>
                  {species.references.map((entry, index) => {
                    const reference = entry.reference;
                    return (
                      <li key={reference?.id || entry.referenceId || `${reference?.title || 'reference'}-${index}`}>
                        {reference?.refCode ? `[${reference.refCode}] ` : ''}
                        {reference?.title || '-'}
                        {reference?.authors ? ` — ${reference.authors}` : ''}
                        {reference?.year ? ` (${reference.year})` : ''}
                        {reference?.source ? ` — ${reference.source}` : ''}
                        {entry.isMainRef ? ' — Referensi utama' : ''}
                      </li>
                    );
                  })}
                </ul>
              ) : <p>Belum ada data referensi.</p>}
            </section>

            {!!species.photos?.length && (
              <section className="species-detail-section species-detail-photo-section">
                <h2>Foto</h2>
                <div className="species-detail-photos">
                  {species.photos.map((photo, index) => {
                    const photoUrl = getPhotoUrl(photo);
                    return photoUrl ? (
                      <figure key={(typeof photo === 'string' ? undefined : photo.id) || photoUrl || index}>
                        <IonImg
                          src={photoUrl}
                          alt={(typeof photo === 'string' ? undefined : photo.alt || photo.caption) || species.commonName}
                        />
                        {typeof photo !== 'string' && (photo.caption || photo.isPrimary) && (
                          <figcaption>{photo.caption || ''}{photo.isPrimary ? ' (Foto utama)' : ''}</figcaption>
                        )}
                      </figure>
                    ) : null;
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </article>
    </MainLayout>
  );
};

export default SpeciesDetailPage;
