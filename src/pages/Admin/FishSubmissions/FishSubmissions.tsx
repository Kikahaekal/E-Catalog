import React, { useEffect, useState } from 'react';
import { getApiErrorMessage } from '../../../utils/apiErrors';
import {
  IonAlert,
  IonButton,
  IonItem,
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
import './FishSubmissions.css';

const getPhotoUrl = (filePath: string): string => {
  if (/^https?:\/\//i.test(filePath)) return filePath;
  const baseUrl = apiClient.defaults.baseURL?.replace(/\/+$/, '') || '';
  return `${baseUrl}/${filePath.replace(/\\/g, '/').replace(/^\/+/, '')}`;
};

const getRequestError = getApiErrorMessage;

// Keep photo failures local to each image; reset naturally when its path changes.
const SubmissionPhoto: React.FC<{ filePath?: string | null; name: string; thumbnail?: boolean }> = ({ filePath, name, thumbnail = false }) => {
  const [failed, setFailed] = useState(false);
  const available = Boolean(filePath?.trim());
  return (
    <div className={`fish-submission-photo${thumbnail ? ' fish-submission-photo--thumbnail' : ''}`}>
      {!available || failed ? (
        <span className="fish-submission-photo__fallback" role="img" aria-label={`Foto ${name} tidak tersedia`}>
          {available ? 'Foto gagal dimuat' : 'Foto tidak tersedia'}
        </span>
      ) : (
        <img src={getPhotoUrl(filePath!)} alt={`Foto ${name}`} onError={() => setFailed(true)} />
      )}
    </div>
  );
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
          <IonButton className="fish-submissions-reload" fill="outline" onClick={fetchData} disabled={loading}>
            Muat Ulang
          </IonButton>
        </div>

        {error && <div className="fish-submissions-error" role="alert"><IonText color="danger">{error}</IonText></div>}
        {loading ? (
          <div className="fish-submissions-message" role="status">
            <IonSpinner name="crescent" />
            <IonText color="medium">Memuat permintaan...</IonText>
          </div>
        ) : error && submissions.length === 0 ? null : submissions.length === 0 ? (
          <div className="fish-submissions-message">
            <IonText color="medium">Belum ada permintaan nama ikan.</IonText>
          </div>
        ) : (
          <div className="fish-submissions-table-wrapper" role="region" aria-label="Permintaan ikan, geser untuk melihat seluruh kolom" tabIndex={0}>
            <table className="fish-submissions-table" aria-label="Permintaan ikan">
              <thead>
                <tr>
                  <th scope="col">Foto</th>
                  <th scope="col">Nama Lokal</th>
                  <th scope="col">Lokasi</th>
                  <th scope="col">Pengusul</th>
                  <th scope="col">Hubungkan ke Spesies</th>
                  <th scope="col">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>
                      <SubmissionPhoto key={submission.photoFilePath} filePath={submission.photoFilePath} name={submission.submittedName} thumbnail />
                    </td>
                    <td>{submission.submittedName}</td>
                    <td>{submission.locationNote || '-'}</td>
                    <td>{submission.submitterName || '-'}</td>
                    <td>
                      <IonItem lines="none" className="fish-submissions-select-item">
                        <IonSelect
                          aria-label={`Hubungkan ${submission.submittedName} ke spesies`}
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
                    <td>
                      <div className="fish-submissions-actions">
                        <IonButton className="fish-submissions-view" size="small" fill="clear" aria-label={`Lihat detail permintaan ${submission.submittedName}`} onClick={() => setDetailItem(submission)}>
                          <img src="/assets/admin/species-eye.svg" width="30" height="30" alt="" />
                        </IonButton>
                        <IonButton
                          className="fish-submissions-approve"
                          aria-label={`Setujui ${submission.submittedName}`}
                          size="small"
                          disabled={!selectedSpecies[submission.id] || processingId === submission.id}
                          onClick={() => handleApprove(submission)}
                        >
                          Setujui
                        </IonButton>
                        <IonButton
                          className="fish-submissions-reject"
                          aria-label={`Tolak ${submission.submittedName}`}
                          size="small"
                          fill="outline"
                          color="danger"
                          disabled={processingId === submission.id}
                          onClick={() => setRejectingId(submission.id)}
                        >
                          Tolak
                        </IonButton>
                      </div>
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
          { label: "Foto", value: <SubmissionPhoto key={`${detailItem.id}:${detailItem.photoFilePath}`} filePath={detailItem.photoFilePath} name={detailItem.submittedName} /> },
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
