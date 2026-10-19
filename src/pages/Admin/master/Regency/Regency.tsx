import "../../../../components/admin/AdminFormModal.css";
import { getApiErrorMessage } from "../../../../utils/apiErrors";
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
import { getAllRegencies, createRegency, editRegency, deleteRegency, Regency } from "../../../../services/regency"; 
import { AdminRecordDetails } from "../../../../components/AdminRecordDetails";
import "./Regency.css"; 

const RegencyPage: React.FC = () => {
  const [regencyList, setRegencyList] = useState<Regency[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [detailItem, setDetailItem] = useState<Regency | null>(null);

  // State Modal & Form Tambah
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newProvince, setNewProvince] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // State Modal & Form Edit
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editProvince, setEditProvince] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // State Hapus
  const [isAlertDeleteOpen, setIsAlertDeleteOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // State Notifikasi
  const [toastMessage, setToastMessage] = useState<string>("");

  // Fetch data Daerah dari API
  const fetchRegencies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllRegencies();
      setRegencyList(response.data || []);
    } catch (err: unknown) {

      const errorMessage =
        getApiErrorMessage(err, "Gagal memuat data daerah dari server.");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegencies();
  }, []);

  // Filter data berdasarkan kata kunci pencarian
  const filteredRegencies = useMemo(() => {
    if (!searchText.trim()) return regencyList;
    const query = searchText.toLowerCase();
    return regencyList.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.province.toLowerCase().includes(query)
    );
  }, [regencyList, searchText]);

  // Handle submit form TAMBAH data
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newProvince.trim()) return;

    setIsSubmitting(true);
    try {
      await createRegency(newName, newProvince);
      setToastMessage("Data kabupaten/kota berhasil ditambahkan");
      setNewName("");
      setNewProvince("");
      setIsModalOpen(false);
      fetchRegencies(); // Refresh data tabel
    } catch (err: unknown) {
      const errMsg = getApiErrorMessage(err, "Gagal menyimpan data kabupaten/kota");
      alert(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi membuka modal EDIT dan isi form dengan data lama
  const openEditModal = (item: Regency) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditProvince(item.province);
    setIsEditModalOpen(true);
  };

  // Handle submit form EDIT data
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editName.trim() || !editProvince.trim()) return;

    setIsEditing(true);
    try {
      await editRegency(editingId, editName, editProvince);
      setToastMessage("Data kabupaten/kota berhasil diperbarui");
      setIsEditModalOpen(false);
      fetchRegencies(); // Refresh data tabel
    } catch (err: unknown) {
      const errMsg = getApiErrorMessage(err, "Gagal memperbarui data kabupaten/kota");
      alert(errMsg);
    } finally {
      setIsEditing(false);
    }
  };

  // Handle konfirmasi HAPUS data
  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteRegency(deletingId);
      setToastMessage("Data kabupaten/kota berhasil dihapus");
      fetchRegencies(); // Refresh data tabel
    } catch (err: unknown) {
      const errMsg = getApiErrorMessage(err, "Gagal menghapus data kabupaten/kota");
      alert(errMsg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-regency-page">
        <div className="regency-toolbar">
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value!)}
            placeholder="Cari nama kabupaten/kota atau provinsi..."
            aria-label="Cari nama kabupaten/kota atau provinsi"
            className="regency-searchbar"
          />
          <IonButton className="regency-add-button" fill="clear" onClick={() => setIsModalOpen(true)}>
            Tambah Data
            <img src="/assets/admin/species-add.svg" width="25" height="25" alt="" />
          </IonButton>
        </div>

        {loading ? (
          <div className="regency-loading-container" role="status">
            <IonSpinner name="crescent" />
            <p><IonText color="medium">Memuat data...</IonText></p>
          </div>
        ) : error ? (
          <div className="regency-message-container regency-error-state" role="alert">
            <p><IonText color="danger">{error}</IonText></p>
            <IonButton onClick={fetchRegencies}>Coba lagi</IonButton>
          </div>
        ) : filteredRegencies.length === 0 ? (
          <div className="regency-message-container">
            <IonText color="medium">{regencyList.length === 0 ? "Belum ada data daerah." : "Tidak ada daerah yang cocok dengan pencarian."}</IonText>
          </div>
        ) : (
          <div className="regency-table-wrapper" role="region" aria-label="Data Daerah, geser untuk melihat seluruh kolom" tabIndex={0}>
            <table className="regency-table" aria-label="Data Daerah">
              <thead>
                <tr className="regency-table-header-row">
                  <th scope="col" className="regency-table-th">No</th>
                  <th scope="col" className="regency-table-th">Nama Kabupaten/Kota</th>
                  <th scope="col" className="regency-table-th">Provinsi</th>
                  <th scope="col" className="regency-table-th regency-text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegencies.map((item, index) => (
                  <tr key={item.id} className="regency-table-row">
                    <td className="regency-table-td">{index + 1}</td>
                    <td className="regency-table-td">{item.name}</td>
                    <td className="regency-table-td">
                      <span>{item.province}</span>
                    </td>
                    <td className="regency-table-td regency-text-center">
                      <div className="regency-row-actions">
                        <IonButton className="regency-action-button" fill="clear" size="small" aria-label={`Lihat detail ${item.name}`} onClick={() => setDetailItem(item)}>
                          <img src="/assets/admin/species-eye.svg" width="30" height="30" alt="" />
                        </IonButton>
                        {/* Tombol Edit */}
                        <IonButton
                          fill="clear"
                          size="small"
                          className="regency-action-button" aria-label={`Edit ${item.name}`}
                          onClick={() => openEditModal(item)}
                        >
                          <img src="/assets/admin/species-edit.svg" width="19.532" height="19.531" alt="" />
                        </IonButton>

                        {/* Tombol Hapus */}
                        <IonButton
                          fill="clear"
                          size="small"
                          className="regency-action-button" aria-label={`Hapus ${item.name}`}
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
        title="Detail Kabupaten/Kota"
        isOpen={detailItem !== null}
        onDismiss={() => setDetailItem(null)}
        fields={detailItem ? [
          { label: "ID", value: detailItem.id },
          { label: "Nama Kabupaten/Kota", value: detailItem.name },
          { label: "Provinsi", value: detailItem.province },
        ] : []}
      />

      {/* Modal Tambah Data */}
      <IonModal className="admin-form-modal" aria-label="Tambah Data Kabupaten/Kota" aria-labelledby="regency-create-title" isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle id="regency-create-title">Tambah Data Kabupaten/Kota</IonTitle>
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
              <IonLabel position="stacked">Nama Kabupaten/Kota</IonLabel>
              <IonInput aria-label="Nama Kabupaten/Kota"
                value={newName}
                placeholder="Contoh: Kabupaten Bintan, Kota Tanjungpinang"
                onIonInput={(e) => setNewName(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem className="regency-form-item">
              <IonLabel position="stacked">Provinsi</IonLabel>
              <IonInput aria-label="Provinsi"
                value={newProvince}
                placeholder="Contoh: Kepulauan Riau"
                onIonInput={(e) => setNewProvince(e.detail.value!)}
                required
              />
            </IonItem>
            </div>
            <div className="regency-form-actions">
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
      <IonModal className="admin-form-modal" aria-label="Edit Data Kabupaten/Kota" aria-labelledby="regency-edit-title" isOpen={isEditModalOpen} onDidDismiss={() => setIsEditModalOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle id="regency-edit-title">Edit Data Kabupaten/Kota</IonTitle>
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
              <IonLabel position="stacked">Nama Kabupaten/Kota</IonLabel>
              <IonInput aria-label="Nama Kabupaten/Kota"
                value={editName}
                placeholder="Contoh: Kabupaten Bintan"
                onIonInput={(e) => setEditName(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem className="regency-form-item">
              <IonLabel position="stacked">Provinsi</IonLabel>
              <IonInput aria-label="Provinsi"
                value={editProvince}
                placeholder="Contoh: Kepulauan Riau"
                onIonInput={(e) => setEditProvince(e.detail.value!)}
                required
              />
            </IonItem>
            </div>
            <div className="regency-form-actions">
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
        message="Apakah Anda yakin ingin menghapus data kabupaten/kota ini?"
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

export default RegencyPage;