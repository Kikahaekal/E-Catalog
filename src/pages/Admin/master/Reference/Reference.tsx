import "../../../../components/admin/AdminFormModal.css";
import { getApiErrorMessage } from "../../../../utils/apiErrors";
import React, { useEffect, useMemo, useState } from "react";
import {
  IonAlert,
  IonButton,
  IonButtons,
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
import { closeOutline } from "ionicons/icons";
import { AdminLayout } from "../../../../layout/AdminLayout";
import { AdminRecordDetails } from "../../../../components/AdminRecordDetails";
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
  const [detailItem, setDetailItem] = useState<Reference | null>(null);

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
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError, "Gagal memuat data referensi dari server."));
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
    } catch (requestError: unknown) {
      alert(getApiErrorMessage(requestError, "Gagal menyimpan data referensi"));
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
    } catch (requestError: unknown) {
      alert(getApiErrorMessage(requestError, "Gagal memperbarui data referensi"));
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
    } catch (requestError: unknown) {
      alert(getApiErrorMessage(requestError, "Gagal menghapus data referensi"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-reference-page">
        <div className="reference-toolbar">
          <IonSearchbar
            value={searchText}
            onIonInput={(event) => setSearchText(event.detail.value || "")}
            placeholder="Cari penulis, judul, sumber, atau kode..."
            aria-label="Cari penulis, judul, sumber, atau kode"
            className="reference-searchbar"
          />
          <IonButton className="reference-add-button" fill="clear" onClick={() => setIsModalOpen(true)}>
            Tambah Data
            <img src="/assets/admin/species-add.svg" width="25" height="25" alt="" />
          </IonButton>
        </div>

        {loading ? (
          <div className="reference-loading-container" role="status">
            <IonSpinner name="crescent" />
            <p><IonText color="medium">Memuat data...</IonText></p>
          </div>
        ) : error ? (
          <div className="reference-message-container reference-error-state" role="alert">
            <p><IonText color="danger">{error}</IonText></p>
            <IonButton onClick={fetchReferences}>Coba lagi</IonButton>
          </div>
        ) : filteredReferences.length === 0 ? (
          <div className="reference-message-container">
            <IonText color="medium">{referenceList.length === 0 ? "Belum ada data referensi." : "Tidak ada referensi yang cocok dengan pencarian."}</IonText>
          </div>
        ) : (
          <div className="reference-table-wrapper" role="region" aria-label="Data Referensi, geser untuk melihat seluruh kolom" tabIndex={0}>
            <table className="reference-table" aria-label="Data Referensi">
              <thead>
                <tr className="reference-table-header-row">
                  <th scope="col" className="reference-table-th">No</th>
                  <th scope="col" className="reference-table-th">Kode</th>
                  <th scope="col" className="reference-table-th">Penulis</th>
                  <th scope="col" className="reference-table-th">Judul</th>
                  <th scope="col" className="reference-table-th">Tahun</th>
                  <th scope="col" className="reference-table-th reference-text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredReferences.map((item, index) => (
                  <tr key={item.id} className="reference-table-row">
                    <td className="reference-table-td">{index + 1}</td>
                    <td className="reference-table-td">
                      {item.refCode !== null && item.refCode !== undefined ? (
                        <span>{item.refCode}</span>
                      ) : "-"}
                    </td>
                    <td className="reference-table-td">{item.authors || "-"}</td>
                    <td className="reference-table-td">{item.title}</td>
                    <td className="reference-table-td">{item.year || "-"}</td>
                    <td className="reference-table-td reference-text-center">
                      <div className="reference-row-actions">
                        <IonButton className="reference-action-button" fill="clear" size="small" aria-label={`Lihat detail ${item.title}`} onClick={() => setDetailItem(item)}>
                          <img src="/assets/admin/species-eye.svg" width="30" height="30" alt="" />
                        </IonButton>
                        <IonButton fill="clear" size="small" className="reference-action-button" aria-label={`Edit ${item.title}`} onClick={() => openEditModal(item)}>
                          <img src="/assets/admin/species-edit.svg" width="19.532" height="19.531" alt="" />
                        </IonButton>
                        <IonButton
                          fill="clear"
                          size="small"
                          className="reference-action-button" aria-label={`Hapus ${item.title}`}
                          onClick={() => {
                            setDeletingId(item.id);
                            setIsAlertDeleteOpen(true);
                          }}
                        >
                          <img src="/assets/admin/species-delete.svg" width="18.75" height="20.3125" alt="" />
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
        title="Detail Referensi"
        isOpen={detailItem !== null}
        onDismiss={() => setDetailItem(null)}
        fields={detailItem ? [
          { label: "ID", value: detailItem.id },
          { label: "Kode", value: detailItem.refCode ?? "-" },
          { label: "Penulis", value: detailItem.authors },
          { label: "Tahun", value: detailItem.year ?? "-" },
          { label: "Judul", value: detailItem.title },
          { label: "Sumber", value: detailItem.source || "-" },
        ] : []}
      />

      <IonModal className="admin-form-modal" aria-label="Tambah Data Referensi" aria-labelledby="reference-create-title" isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle id="reference-create-title">Tambah Data Referensi</IonTitle>
            <IonButtons slot="end">
              <IonButton aria-label="Tutup form" onClick={() => setIsModalOpen(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <div className="admin-form-modal__body">
          <form onSubmit={handleCreate}>
            <div className="admin-form-modal__fields">
              <p className="admin-form-modal__hint">Kolom bertanda * wajib diisi.</p>
            <IonItem>
              <IonLabel position="stacked">Kode Referensi</IonLabel>
              <IonInput aria-label="Kode Referensi" value={newRefCode} type="number" min={1} onIonInput={(event) => setNewRefCode(event.detail.value || "")} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Penulis</IonLabel>
              <IonInput aria-label="Penulis" value={newAuthors} onIonInput={(event) => setNewAuthors(event.detail.value || "")} required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Tahun</IonLabel>
              <IonInput aria-label="Tahun" value={newYear} type="number" min={1900} max={2100} onIonInput={(event) => setNewYear(event.detail.value || "")} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Judul</IonLabel>
              <IonInput aria-label="Judul" value={newTitle} onIonInput={(event) => setNewTitle(event.detail.value || "")} required />
            </IonItem>
            <IonItem className="reference-form-item">
              <IonLabel position="stacked">Sumber</IonLabel>
              <IonInput aria-label="Sumber" value={newSource} onIonInput={(event) => setNewSource(event.detail.value || "")} />
            </IonItem>
            </div>
            <div className="reference-form-actions">
              <IonButton fill="clear" color="medium" onClick={() => setIsModalOpen(false)}>Batal</IonButton>
              <IonButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>

      <IonModal className="admin-form-modal" aria-label="Edit Data Referensi" aria-labelledby="reference-edit-title" isOpen={isEditModalOpen} onDidDismiss={() => setIsEditModalOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle id="reference-edit-title">Edit Data Referensi</IonTitle>
            <IonButtons slot="end">
              <IonButton aria-label="Tutup form" onClick={() => setIsEditModalOpen(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <div className="admin-form-modal__body">
          <form onSubmit={handleEdit}>
            <div className="admin-form-modal__fields">
              <p className="admin-form-modal__hint">Kolom bertanda * wajib diisi.</p>
            <IonItem>
              <IonLabel position="stacked">Kode Referensi</IonLabel>
              <IonInput aria-label="Kode Referensi" value={editRefCode} type="number" min={1} onIonInput={(event) => setEditRefCode(event.detail.value || "")} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Penulis</IonLabel>
              <IonInput aria-label="Penulis" value={editAuthors} onIonInput={(event) => setEditAuthors(event.detail.value || "")} required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Tahun</IonLabel>
              <IonInput aria-label="Tahun" value={editYear} type="number" min={1900} max={2100} onIonInput={(event) => setEditYear(event.detail.value || "")} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Judul</IonLabel>
              <IonInput aria-label="Judul" value={editTitle} onIonInput={(event) => setEditTitle(event.detail.value || "")} required />
            </IonItem>
            <IonItem className="reference-form-item">
              <IonLabel position="stacked">Sumber</IonLabel>
              <IonInput aria-label="Sumber" value={editSource} onIonInput={(event) => setEditSource(event.detail.value || "")} />
            </IonItem>
            </div>
            <div className="reference-form-actions">
              <IonButton fill="clear" color="medium" onClick={() => setIsEditModalOpen(false)}>Batal</IonButton>
              <IonButton type="submit" disabled={isEditing}>
                {isEditing ? "Menyimpan..." : "Simpan Perubahan"}
              </IonButton>
            </div>
          </form>
        </div>
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
