import React, { useEffect, useState, useMemo } from "react";
import {
  IonSearchbar,
  IonButton,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSpinner,
  IonText,
  IonBadge,
  IonButtons,
  IonToast,
  IonAlert
} from "@ionic/react";
import { addOutline, closeOutline, pencilOutline, trashOutline } from "ionicons/icons";
import { AdminLayout } from "../../../../layout/AdminLayout";
import { getAllRegencies, createRegency, editRegency, deleteRegency, Regency } from "../../../../services/regency"; 
import "./Regency.css"; 

const RegencyPage: React.FC = () => {
  const [regencyList, setRegencyList] = useState<Regency[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");

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
    } catch (err: any) {
      console.error("Gagal mengambil data daerah:", err);
      const errorMessage =
        err.response?.data?.error || "Gagal memuat data daerah dari server.";
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
    } catch (err: any) {
      const errMsg = err.response?.data?.error || "Gagal menyimpan data kabupaten/kota";
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
    } catch (err: any) {
      const errMsg = err.response?.data?.error || "Gagal memperbarui data kabupaten/kota";
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
    } catch (err: any) {
      const errMsg = err.response?.data?.error || "Gagal menghapus data kabupaten/kota";
      alert(errMsg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="ion-padding">
        <IonSearchbar
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value!)}
          placeholder="Cari nama kabupaten/kota atau provinsi..."
          className="regency-searchbar"
        />

        <div className="regency-header-container">
          <h2 className="regency-title">
            Data Daerah / Kabupaten
          </h2>
          <IonButton onClick={() => setIsModalOpen(true)}>
            <IonIcon slot="start" icon={addOutline} />
            Tambah Data
          </IonButton>
        </div>

        {loading ? (
          <div className="regency-loading-container">
            <IonSpinner name="crescent" />
            <p><IonText color="medium">Memuat data...</IonText></p>
          </div>
        ) : error ? (
          <div className="regency-message-container">
            <IonText color="danger">{error}</IonText>
          </div>
        ) : filteredRegencies.length === 0 ? (
          <div className="regency-message-container">
            <IonText color="medium">Data daerah tidak ditemukan.</IonText>
          </div>
        ) : (
          <div className="regency-table-wrapper">
            <table className="regency-table">
              <thead>
                <tr className="regency-table-header-row">
                  <th className="regency-table-th">No</th>
                  <th className="regency-table-th">Nama Kabupaten/Kota</th>
                  <th className="regency-table-th">Provinsi</th>
                  <th className="regency-table-th regency-text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegencies.map((item, index) => (
                  <tr key={item.id} className="regency-table-row">
                    <td className="regency-table-td">{index + 1}</td>
                    <td className="regency-table-td">{item.name}</td>
                    <td className="regency-table-td">
                      <IonBadge color="primary">{item.province}</IonBadge>
                    </td>
                    <td className="regency-table-td regency-text-center">
                      {/* Tombol Edit */}
                      <IonButton 
                        fill="clear" 
                        size="small" 
                        color="warning"
                        onClick={() => openEditModal(item)}
                      >
                        <IonIcon slot="icon-only" icon={pencilOutline} />
                      </IonButton>
                      
                      {/* Tombol Hapus */}
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

      {/* Modal Tambah Data */}
      <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Tambah Data Kabupaten/Kota</IonTitle>
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
              <IonLabel position="stacked">Nama Kabupaten/Kota</IonLabel>
              <IonInput
                value={newName}
                placeholder="Contoh: Kabupaten Bintan, Kota Tanjungpinang"
                onIonInput={(e) => setNewName(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem className="regency-form-item">
              <IonLabel position="stacked">Provinsi</IonLabel>
              <IonInput
                value={newProvince}
                placeholder="Contoh: Kepulauan Riau"
                onIonInput={(e) => setNewProvince(e.detail.value!)}
                required
              />
            </IonItem>
            <div className="regency-form-actions">
              <IonButton fill="clear" color="medium" onClick={() => setIsModalOpen(false)}>
                Batal
              </IonButton>
              <IonButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </IonButton>
            </div>
          </form>
        </IonContent>
      </IonModal>

      {/* Modal Edit Data */}
      <IonModal isOpen={isEditModalOpen} onDidDismiss={() => setIsEditModalOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Data Kabupaten/Kota</IonTitle>
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
              <IonLabel position="stacked">Nama Kabupaten/Kota</IonLabel>
              <IonInput
                value={editName}
                placeholder="Contoh: Kabupaten Bintan"
                onIonInput={(e) => setEditName(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem className="regency-form-item">
              <IonLabel position="stacked">Provinsi</IonLabel>
              <IonInput
                value={editProvince}
                placeholder="Contoh: Kepulauan Riau"
                onIonInput={(e) => setEditProvince(e.detail.value!)}
                required
              />
            </IonItem>
            <div className="regency-form-actions">
              <IonButton fill="clear" color="medium" onClick={() => setIsEditModalOpen(false)}>
                Batal
              </IonButton>
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