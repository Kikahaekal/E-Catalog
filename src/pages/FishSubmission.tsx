import React, { useState } from 'react';
import { isAxiosError } from 'axios';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  IonTextarea,
  IonToast
} from '@ionic/react';
import { MainLayout } from '../layout/MainLayout';
import { submitFishName } from '../services/fish';
import './FishSubmission.css';

const FishSubmissionPage: React.FC = () => {
  const [submittedName, setSubmittedName] = useState('');
  const [locationNote, setLocationNote] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!submittedName.trim() || !locationNote.trim() || !photo) {
      setError('Nama lokal, lokasi, dan foto wajib diisi.');
      return;
    }

    const formData = new FormData();
    formData.append('submittedName', submittedName.trim());
    formData.append('locationNote', locationNote.trim());
    formData.append('photoFilePath', photo);

    setIsSubmitting(true);
    setError('');
    try {
      await submitFishName(formData);
      setSubmittedName('');
      setLocationNote('');
      setPhoto(null);
      const fileInput = document.getElementById('fish-submission-photo') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';
      setToastMessage('Usulan nama ikan berhasil dikirim. Terima kasih!');
    } catch (requestError: unknown) {
      if (isAxiosError<{ error?: string; message?: string }>(requestError)) {
        const responseMessage = requestError.response?.data?.error || requestError.response?.data?.message;
        setError(
          responseMessage ||
          (requestError.response
            ? `Gagal mengirim usulan (HTTP ${requestError.response.status}).`
            : `${requestError.message}. Periksa koneksi ke server.`)
        );
      } else {
        setError('Gagal mengirim usulan nama ikan.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <section className="fish-submission-page">
        <h1>Usulkan Nama Lokal Ikan</h1>
        <p className="fish-submission-intro">Bagikan nama lokal ikan beserta lokasi dan foto untuk ditinjau oleh admin.</p>
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="stacked">Nama Lokal Ikan</IonLabel>
            <IonInput
              value={submittedName}
              onIonInput={(event) => setSubmittedName(event.detail.value ?? '')}
              required
            />
          </IonItem>
          <IonItem className="fish-submission-location">
            <IonLabel position="stacked">Lokasi Ditemukan</IonLabel>
            <IonTextarea
              value={locationNote}
              onIonInput={(event) => setLocationNote(event.detail.value ?? '')}
              autoGrow
              required
            />
          </IonItem>
          <div className="fish-submission-photo-field">
            <label htmlFor="fish-submission-photo">Foto Ikan</label>
            <input
              id="fish-submission-photo"
              type="file"
              accept="image/*"
              required
              onChange={(event) => setPhoto(event.target.files?.[0] || null)}
            />
          </div>
          {error && <IonText color="danger"><p className="fish-submission-error">{error}</p></IonText>}
          <div className="fish-submission-actions">
            <IonButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Mengirim...' : 'Kirim Usulan'}
            </IonButton>
          </div>
        </form>
      </section>
      <IonToast
        isOpen={!!toastMessage}
        message={toastMessage}
        duration={2500}
        onDidDismiss={() => setToastMessage('')}
      />
    </MainLayout>
  );
};

export default FishSubmissionPage;
