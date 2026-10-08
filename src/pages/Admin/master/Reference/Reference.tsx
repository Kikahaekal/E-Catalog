import React, { useEffect, useMemo, useState } from "react";
import {
  IonAlert,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonSearchbar,
  IonSpinner,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { addOutline, closeOutline, pencilOutline, trashOutline } from "ionicons/icons";
import { AdminLayout } from "../../../../layout/AdminLayout";
import {
  createReference,
  deleteReference,
  editReference,
  getAllReferences,
  Reference,
  ReferencePayload,
} from "../../../../services/reference";
import "./Reference.css";

const ReferencePage: React.FC = () => {
  const [referenceList, setReferenceList] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRefCode, setNewRefCode] = useState("");
  const [newAuthors, setNewAuthors] = useState("");
  const [newYear, setNewYear] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newSource, setNewSource] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editRefCode, setEditRefCode] = useState("");
  const [editAuthors, setEditAuthors] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editSource, setEditSource] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [isAlertDeleteOpen, setIsAlertDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const fetchReferences = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllReferences();
      setReferenceList(response.data || []);
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || "Gagal memuat data referensi dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferences();
  }, []);

  const filteredReferences = useMemo(() => {
    if (!searchText.trim()) return referenceList;

    const query = searchText.toLowerCase();
    return referenceList.filter((item) =>
      item.authors.toLowerCase().includes(query) ||
      item.title.toLowerCase().includes(query) ||
      item.source?.toLowerCase().includes(query) ||
      (item.refCode !== null && item.refCode !== undefined && String(item.refCode).includes(query)),
    );
  }, [referenceList, searchText]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newAuthors.trim() || !newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const payload: ReferencePayload = {
        refCode: newRefCode ? Number(newRefCode) : null,
        authors: newAuthors.trim(),
        year: newYear ? Number(newYear) : null,
        title: newTitle.trim(),
        source: newSource.trim() || null,
      };
      await createReference(payload);
      setToastMessage("Data referensi berhasil ditambahkan");
      setNewRefCode("");
      setNewAuthors("");
      setNewYear("");
      setNewTitle("");
      setNewSource("");
      setIsModalOpen(false);
      fetchReferences();
    } catch (requestError: any) {
      alert(requestError.response?.data?.error || "Gagal menyimpan data referensi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (item: Reference) => {
    setEditingId(item.id);
    setEditRefCode(item.refCode !== null && item.refCode !== undefined ? String(item.refCode) : "");
    setEditAuthors(item.authors);
    setEditYear(item.year !== null && item.year !== undefined ? String(item.year) : "");
    setEditTitle(item.title);
    setEditSource(item.source || "");
    setIsEditModalOpen(true);
  };

  const handleEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingId || !editAuthors.trim() || !editTitle.trim()) return;

    setIsEditing(true);
    try {
      const payload: ReferencePayload = {
        refCode: editRefCode ? Number(editRefCode) : null,
        authors: editAuthors.trim(),
        year: editYear ? Number(editYear) : null,
        title: editTitle.trim(),
        source: editSource.trim() || null,
      };
      await editReference(editingId, payload);
      setToastMessage("Data referensi berhasil diperbarui");
      setIsEditModalOpen(false);
      fetchReferences();
    } catch (requestError: any) {
      alert(requestError.response?.data?.error || "Gagal memperbarui data referensi");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteReference(deletingId);
      setToastMessage("Data referensi berhasil dihapus");
      fetchReferences();
    } catch (requestError: any) {
      alert(requestError.response?.data?.error || "Gagal menghapus data referensi");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="ion-padding">
        <IonSearchbar
          value={searchText}
          onIonInput={(event) => setSearchText(event.detail.value || "")}
          placeholder="Cari penulis, judul, sumber, atau kode..."
          className="reference-searchbar"
        />

        <div className="reference-header-container">
          <h2 className="reference-title">Data Referensi</h2>
          <IonButton onClick={() => setIsModalOpen(true)}>
            <IonIcon slot="start" icon={addOutline} />
            Tambah Data
          </IonButton>
        </div>

        {loading ? (
          <div className="reference-loading-container">
            <IonSpinner name="crescent" />
            <p><IonText color="medium">Memuat data...</IonText></p>
          </div>
        ) : error ? (
          <div className="reference-message-container">
            <IonText color="danger">{error}</IonText>
          </div>
        ) : filteredReferences.length === 0 ? (
          <div className="reference-message-container">
            <IonText color="medium">Data referensi tidak ditemukan.</IonText>
          </div>
        ) : (
          <div className="reference-table-wrapper">
            <table className="reference-table">
              <thead>
                <tr className="reference-table-header-row">
                  <th className="reference-table-th">No</th>
                  <th className="reference-table-th">Kode</th>
                  <th className="reference-table-th">Penulis</th>
                  <th className="reference-table-th">Judul</th>
                  <th className="reference-table-th">Tahun</th>
                  <th className="reference-table-th reference-text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredReferences.map((item, index) => (
                  <tr key={item.id} className="reference-table-row">
                    <td className="reference-table-td">{index + 1}</td>
                    <td className="reference-table-td">
                      {item.refCode !== null && item.refCode !== undefined ? (
                        <IonBadge color="primary">{item.refCode}</IonBadge>
                      ) : "-"}
                    </td>
                    <td className="reference-table-td">{item.authors || "-"}</td>
                    <td className="reference-table-td">{item.title}</td>
                    <td className="reference-table-td">{item.year || "-"}</td>
                    <td className="reference-table-td reference-text-center">
                      <IonButton fill="clear" size="small" color="warning" onClick={() => openEditModal(item)}>
                        <IonIcon slot="icon-only" icon={pencilOutline} />
                      </IonButton>
                      <IonButton
                        fill="clear"
                        size="small"
                        color="danger"
                        onClick={() => {
                          setDeletingId(item.id);
                          setIsAlertDeleteOpen(true);
                        }}
                      >
                        <IonIcon slot="icon-only" icon={trashOutline} />
                      </IonButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Tambah Data Referensi</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsModalOpen(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <form onSubmit={handleCreate}>
            <IonItem>
              <IonLabel position="stacked">Kode Referensi</IonLabel>
              <IonInput value={newRefCode} type="number" min={1} onIonInput={(event) => setNewRefCode(event.detail.value || "")} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Penulis</IonLabel>
              <IonInput value={newAuthors} onIonInput={(event) => setNewAuthors(event.detail.value || "")} required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Tahun</IonLabel>
              <IonInput value={newYear} type="number" min={1900} max={2100} onIonInput={(event) => setNewYear(event.detail.value || "")} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Judul</IonLabel>
              <IonInput value={newTitle} onIonInput={(event) => setNewTitle(event.detail.value || "")} required />
            </IonItem>
            <IonItem className="reference-form-item">
              <IonLabel position="stacked">Sumber</IonLabel>
              <IonInput value={newSource} onIonInput={(event) => setNewSource(event.detail.value || "")} />
            </IonItem>
            <div className="reference-form-actions">
              <IonButton fill="clear" color="medium" onClick={() => setIsModalOpen(false)}>Batal</IonButton>
              <IonButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </IonButton>
            </div>
          </form>
        </IonContent>
      </IonModal>

      <IonModal isOpen={isEditModalOpen} onDidDismiss={() => setIsEditModalOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Data Referensi</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsEditModalOpen(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <form onSubmit={handleEdit}>
            <IonItem>
              <IonLabel position="stacked">Kode Referensi</IonLabel>
              <IonInput value={editRefCode} type="number" min={1} onIonInput={(event) => setEditRefCode(event.detail.value || "")} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Penulis</IonLabel>
              <IonInput value={editAuthors} onIonInput={(event) => setEditAuthors(event.detail.value || "")} required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Tahun</IonLabel>
              <IonInput value={editYear} type="number" min={1900} max={2100} onIonInput={(event) => setEditYear(event.detail.value || "")} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Judul</IonLabel>
              <IonInput value={editTitle} onIonInput={(event) => setEditTitle(event.detail.value || "")} required />
            </IonItem>
            <IonItem className="reference-form-item">
              <IonLabel position="stacked">Sumber</IonLabel>
              <IonInput value={editSource} onIonInput={(event) => setEditSource(event.detail.value || "")} />
            </IonItem>
            <div className="reference-form-actions">
              <IonButton fill="clear" color="medium" onClick={() => setIsEditModalOpen(false)}>Batal</IonButton>
              <IonButton type="submit" disabled={isEditing}>
                {isEditing ? "Menyimpan..." : "Simpan Perubahan"}
              </IonButton>
            </div>
          </form>
        </IonContent>
      </IonModal>

      <IonAlert
        isOpen={isAlertDeleteOpen}
        onDidDismiss={() => {
          setIsAlertDeleteOpen(false);
          setDeletingId(null);
        }}
        header="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus data referensi ini?"
        buttons={[
          { text: "Batal", role: "cancel", handler: () => setDeletingId(null) },
          { text: "Hapus", role: "destructive", handler: handleDelete },
        ]}
      />

      <IonToast
        isOpen={!!toastMessage}
        message={toastMessage}
        duration={2000}
        onDidDismiss={() => setToastMessage("")}
      />
    </AdminLayout>
  );
};

export default ReferencePage;
