import React, { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import {
  IonAlert,
  IonButton,
  IonItem,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonToast
} from '@ionic/react';
import { AdminLayout } from '../../../layout/AdminLayout';
import { AdminRecordDetails } from '../../../components/AdminRecordDetails';
import { apiClient } from '../../../services/api';
import {
  approveSubmission,
  getAllFishSubmissions,
  rejectSubmission,
  UserSubmission
} from '../../../services/fish';
import { getAllSpecies, Species } from '../../../services/species';
import { eyeOutline } from 'ionicons/icons';
import './FishSubmissions.css';

const getPhotoUrl = (filePath: string): string => {
  if (/^https?:\/\//i.test(filePath)) return filePath;
  const baseUrl = apiClient.defaults.baseURL?.replace(/\/+$/, '') || '';
  return `${baseUrl}/${filePath.replace(/\\/g, '/').replace(/^\/+/, '')}`;
};

const getRequestError = (error: unknown, fallback: string): string => {
  if (isAxiosError<{ error?: string }>(error)) {
    return error.response?.data?.error || fallback;
  }
  return fallback;
};

const FishSubmissionsAdminPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<Record<string, string | number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | number | null>(null);
  const [rejectingId, setRejectingId] = useState<string | number | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [detailItem, setDetailItem] = useState<UserSubmission | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [submissionResponse, speciesResponse] = await Promise.all([
        getAllFishSubmissions(),
        getAllSpecies()
      ]);
      setSubmissions(submissionResponse.data || []);
      setSpeciesList(speciesResponse.data || []);
    } catch (requestError: unknown) {
      setError(getRequestError(requestError, 'Gagal memuat data permintaan.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (submission: UserSubmission) => {
    const speciesId = selectedSpecies[submission.id];
    if (!speciesId) return;

    setProcessingId(submission.id);
    try {
      await approveSubmission(submission.id, speciesId);
      setToastMessage('Permintaan berhasil disetujui.');
      setSelectedSpecies((current) => {
        const next = { ...current };
        delete next[submission.id];
        return next;
      });
      await fetchData();
    } catch (requestError: unknown) {
      setError(getRequestError(requestError, 'Gagal menyetujui permintaan.'));
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectingId) return;

    setProcessingId(rejectingId);
    try {
      await rejectSubmission(rejectingId);
      setToastMessage('Permintaan berhasil ditolak.');
      await fetchData();
    } catch (requestError: unknown) {
      setError(getRequestError(requestError, 'Gagal menolak permintaan.'));
    } finally {
      setProcessingId(null);
      setRejectingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="fish-submissions-page">
        <div className="fish-submissions-header">
          <h1>Permintaan Nama Ikan</h1>
          <IonButton fill="outline" onClick={fetchData} disabled={loading}>
            Muat Ulang
          </IonButton>
        </div>

        {error && <IonText color="danger"><p className="fish-submissions-error">{error}</p></IonText>}
        {loading ? (
          <div className="fish-submissions-message">
            <IonSpinner name="crescent" />
            <IonText color="medium">Memuat permintaan...</IonText>
          </div>
        ) : submissions.length === 0 ? (
          <div className="fish-submissions-message">
            <IonText color="medium">Belum ada permintaan nama ikan.</IonText>
          </div>
        ) : (
          <div className="fish-submissions-table-wrapper">
            <table className="fish-submissions-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nama Lokal</th>
                  <th>Lokasi</th>
                  <th>Pengusul</th>
                  <th>Hubungkan ke Spesies</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>
                      <img
                        className="fish-submission-thumbnail"
                        src={getPhotoUrl(submission.photoFilePath)}
                        alt={`Foto ${submission.submittedName}`}
                        onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }}
                      />
                    </td>
                    <td>{submission.submittedName}</td>
                    <td>{submission.locationNote || '-'}</td>
                    <td>{submission.submitterName || '-'}</td>
                    <td>
                      <IonItem lines="none" className="fish-submissions-select-item">
                        <IonSelect
                          value={selectedSpecies[submission.id] ?? ''}
                          placeholder="Pilih spesies"
                          onIonChange={(event) => setSelectedSpecies((current) => ({
                            ...current,
                            [submission.id]: event.detail.value
                          }))}
                        >
                          {speciesList.map((species) => (
                            <IonSelectOption key={species.id} value={species.id}>
                              {species.commonName} ({species.scientificName})
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonItem>
                    </td>
                    <td className="fish-submissions-actions">
                      <IonButton size="small" fill="clear" aria-label={`Lihat detail permintaan ${submission.submittedName}`} onClick={() => setDetailItem(submission)}>
                        <IonIcon slot="icon-only" icon={eyeOutline} />
                      </IonButton>
                      <IonButton
                        size="small"
                        disabled={!selectedSpecies[submission.id] || processingId === submission.id}
                        onClick={() => handleApprove(submission)}
                      >
                        Setujui
                      </IonButton>
                      <IonButton
                        size="small"
                        fill="outline"
                        color="danger"
                        disabled={processingId === submission.id}
                        onClick={() => setRejectingId(submission.id)}
                      >
                        Tolak
                      </IonButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AdminRecordDetails
        title="Detail Permintaan Nama Ikan"
        isOpen={detailItem !== null}
        onDismiss={() => setDetailItem(null)}
        fields={detailItem ? [
          { label: "ID", value: detailItem.id },
          { label: "Nama Lokal", value: detailItem.submittedName },
          { label: "Lokasi", value: detailItem.locationNote || "-" },
          { label: "Pengusul", value: detailItem.submitterName || "-" },
          { label: "Foto", value: <img src={getPhotoUrl(detailItem.photoFilePath)} alt={`Foto ${detailItem.submittedName}`} /> },
          { label: "Dibuat", value: detailItem.createdAt || "-" },
          { label: "Diperbarui", value: detailItem.updatedAt || "-" },
        ] : []}
      />

      <IonAlert
        isOpen={rejectingId !== null}
        onDidDismiss={() => setRejectingId(null)}
        header="Tolak Permintaan"
        message="Apakah Anda yakin ingin menolak dan menghapus permintaan ini?"
        buttons={[
          { text: 'Batal', role: 'cancel' },
          { text: 'Tolak', role: 'destructive', handler: () => { void handleReject(); } }
        ]}
      />
      <IonToast
        isOpen={!!toastMessage}
        message={toastMessage}
        duration={2200}
        onDidDismiss={() => setToastMessage('')}
      />
    </AdminLayout>
  );
};

export default FishSubmissionsAdminPage;
