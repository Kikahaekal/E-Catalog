import "../../../../components/admin/AdminFormModal.css";
import { getApiErrorMessage, isEmptyMasterList } from "../../../../utils/apiErrors";
import React, { useEffect, useState, useMemo } from "react";
import {
  IonSearchbar,
  IonButton,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonSpinner,
  IonText,
  IonButtons,
  IonToast,
  IonAlert
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { AdminLayout } from "../../../../layout/AdminLayout";
import { getAllIucn, createIucn, editIucn, deleteIucn, Iucn } from "../../../../services/iucn"; 
import { AdminRecordDetails } from "../../../../components/AdminRecordDetails";
import "./Iucn.css"; 

const IucnPage: React.FC = () => {
  const [iucnList, setIucnList] = useState<Iucn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [detailItem, setDetailItem] = useState<Iucn | null>(null);

  // State Modal & Form Tambah
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newCode, setNewCode] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // State Modal & Form Edit
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editCode, setEditCode] = useState<string>("");
  const [editName, setEditName] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // State Hapus
  const [isAlertDeleteOpen, setIsAlertDeleteOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // State Notifikasi
  const [toastMessage, setToastMessage] = useState<string>("");

  // Fetch data IUCN dari API
  const fetchIucn = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllIucn();
      setIucnList(response.data || []);
    } catch (err: unknown) {
      // The list controller uses this exact response for an empty database.
      if (isEmptyMasterList(err, "iucn")) {
        setIucnList([]);
        return;
      }

      const errorMessage =
        getApiErrorMessage(err, "Gagal memuat data IUCN dari server.");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIucn();
  }, []);

  // Filter data berdasarkan kata kunci pencarian
  const filteredIucn = useMemo(() => {
    if (!searchText.trim()) return iucnList;
    const query = searchText.toLowerCase();
    return iucnList.filter(
      (item) =>
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query)
    );
  }, [iucnList, searchText]);

  // Handle submit form TAMBAH data
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;

    setIsSubmitting(true);
    try {
      await createIucn(newCode, newName);
      setToastMessage("Data IUCN berhasil ditambahkan");
      setNewCode("");
      setNewName("");
      setIsModalOpen(false);
      fetchIucn(); // Refresh data tabel
    } catch (err: unknown) {
      const errMsg = getApiErrorMessage(err, "Gagal menyimpan data IUCN");
      alert(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi membuka modal EDIT dan isi form dengan data lama
  const openEditModal = (item: Iucn) => {
    setEditingId(item.id);
    setEditCode(item.code);
    setEditName(item.name);
    setIsEditModalOpen(true);
  };

  // Handle submit form EDIT data
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editCode.trim() || !editName.trim()) return;

    setIsEditing(true);
    try {
      await editIucn(editingId, editCode, editName);
      setToastMessage("Data IUCN berhasil diperbarui");
      setIsEditModalOpen(false);
      fetchIucn(); // Refresh data tabel
    } catch (err: unknown) {
      const errMsg = getApiErrorMessage(err, "Gagal memperbarui data IUCN");
      alert(errMsg);
    } finally {
      setIsEditing(false);
    }
  };

  // Handle konfirmasi HAPUS data
  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteIucn(deletingId);
      setToastMessage("Data IUCN berhasil dihapus");
      fetchIucn(); // Refresh data tabel
    } catch (err: unknown) {
      const errMsg = getApiErrorMessage(err, "Gagal menghapus data IUCN (mungkin sedang digunakan)");
      alert(errMsg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-iucn-page">
        <div className="iucn-toolbar">
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value!)}
            placeholder="Cari kode atau nama IUCN..."
            aria-label="Cari kode atau nama IUCN"
            className="iucn-searchbar"
          />
          <IonButton className="iucn-add-button" fill="clear" onClick={() => setIsModalOpen(true)}>
            Tambah Data
            <img src="/assets/admin/species-add.svg" width="25" height="25" alt="" />
          </IonButton>
        </div>

        {loading ? (
          <div className="iucn-loading-container" role="status">
            <IonSpinner name="crescent" />
            <p><IonText color="medium">Memuat data...</IonText></p>
          </div>
        ) : error ? (
          <div className="iucn-message-container iucn-error-state" role="alert">
            <p><IonText color="danger">{error}</IonText></p>
            <IonButton onClick={fetchIucn}>Coba lagi</IonButton>
          </div>
        ) : filteredIucn.length === 0 ? (
          <div className="iucn-message-container">
            <IonText color="medium">{iucnList.length === 0 ? "Belum ada data IUCN." : "Tidak ada IUCN yang cocok dengan pencarian."}</IonText>
          </div>
        ) : (
          <div className="iucn-table-wrapper" role="region" aria-label="Tabel IUCN, geser untuk melihat seluruh kolom" tabIndex={0}>
            <table className="iucn-table" aria-label="Data IUCN">
              <thead>
                <tr className="iucn-table-header-row">
                  <th scope="col" className="iucn-table-th">No</th>
                  <th scope="col" className="iucn-table-th">Kode</th>
                  <th scope="col" className="iucn-table-th">Nama Status</th>
                  <th scope="col" className="iucn-table-th iucn-text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredIucn.map((item, index) => (
                  <tr key={item.id} className="iucn-table-row">
                    <td className="iucn-table-td">{index + 1}</td>
                    <td className="iucn-table-td">
                      <span>{item.code}</span>
                    </td>
                    <td className="iucn-table-td">{item.name}</td>
                    <td className="iucn-table-td iucn-text-center">
                      <div className="iucn-row-actions">
                        <IonButton className="iucn-action-button" fill="clear" size="small" aria-label={`Lihat detail ${item.code}`} onClick={() => setDetailItem(item)}>
                          <img src="/assets/admin/species-eye.svg" width="30" height="30" alt="" />
                        </IonButton>
                        {/* Tombol Edit */}
                        <IonButton
                          fill="clear"
                          size="small"
                          className="iucn-action-button"
                          aria-label={`Edit ${item.code}`}
                          onClick={() => openEditModal(item)}
                        >
                          <img src="/assets/admin/species-edit.svg" width="19.532" height="19.531" alt="" />
                        </IonButton>

                        {/* Tombol Hapus */}
                        <IonButton
                          fill="clear"
                          size="small"
                          className="iucn-action-button"
                          aria-label={`Hapus ${item.code}`}
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
        title="Detail IUCN"
        isOpen={detailItem !== null}
        onDismiss={() => setDetailItem(null)}
        fields={detailItem ? [
          { label: "ID", value: detailItem.id },
          { label: "Kode", value: detailItem.code },
          { label: "Nama Status", value: detailItem.name },
        ] : []}
      />

      {/* Modal Tambah Data */}
      <IonModal className="admin-form-modal" aria-label="Tambah Data IUCN" aria-labelledby="iucn-create-title" isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle id="iucn-create-title">Tambah Data IUCN</IonTitle>
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
              <IonLabel position="stacked">Kode IUCN</IonLabel>
              <IonInput aria-label="Kode IUCN"
                value={newCode}
                placeholder="Contoh: CR, EN, VU"
                onIonInput={(e) => setNewCode(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem className="iucn-form-item">
              <IonLabel position="stacked">Nama Status</IonLabel>
              <IonInput aria-label="Nama Status"
                value={newName}
                placeholder="Contoh: Critically Endangered"
                onIonInput={(e) => setNewName(e.detail.value!)}
                required
              />
            </IonItem>
            </div>
            <div className="iucn-form-actions">
              <IonButton fill="clear" color="medium" onClick={() => setIsModalOpen(false)}>
                Batal
              </IonButton>
              <IonButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>

      {/* Modal Edit Data */}
      <IonModal className="admin-form-modal" aria-label="Edit Data IUCN" aria-labelledby="iucn-edit-title" isOpen={isEditModalOpen} onDidDismiss={() => setIsEditModalOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle id="iucn-edit-title">Edit Data IUCN</IonTitle>
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
              <IonLabel position="stacked">Kode IUCN</IonLabel>
              <IonInput aria-label="Kode IUCN"
                value={editCode}
                placeholder="Contoh: CR, EN, VU"
                onIonInput={(e) => setEditCode(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem className="iucn-form-item">
              <IonLabel position="stacked">Nama Status</IonLabel>
              <IonInput aria-label="Nama Status"
                value={editName}
                placeholder="Contoh: Critically Endangered"
                onIonInput={(e) => setEditName(e.detail.value!)}
                required
              />
            </IonItem>
            </div>
            <div className="iucn-form-actions">
              <IonButton fill="clear" color="medium" onClick={() => setIsEditModalOpen(false)}>
                Batal
              </IonButton>
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
        message="Apakah Anda yakin ingin menghapus data IUCN ini? Data yang terhubung ke spesies mungkin tidak bisa dihapus."
        buttons={[
          {
            text: "Batal",
            role: "cancel",
            handler: () => setDeletingId(null),
          },
          {
            text: "Hapus",
            role: "destructive",
            handler: handleDelete,
          },
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

export default IucnPage;