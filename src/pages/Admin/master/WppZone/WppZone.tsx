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
import { getAllWpp, createWpp, editWpp, deleteWpp, Wpp } from "../../../../services/wpp"; 
import "./WppZone.css"; 

const WppZonePage: React.FC = () => {
  const [wppList, setWppList] = useState<Wpp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  // State Modal & Form Tambah
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newCode, setNewCode] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // State Modal & Form Edit
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editCode, setEditCode] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // State Hapus
  const [isAlertDeleteOpen, setIsAlertDeleteOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // State Notifikasi
  const [toastMessage, setToastMessage] = useState<string>("");

  // Fetch data WPP dari API
  const fetchWpp = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllWpp();
      setWppList(response.data || []);
    } catch (err: any) {
      console.error("Gagal mengambil data WPP:", err);
      const errorMessage =
        err.response?.data?.error || "Gagal memuat data WPP dari server.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWpp();
  }, []);

  // Filter data berdasarkan kata kunci pencarian
  const filteredWpp = useMemo(() => {
    if (!searchText.trim()) return wppList;
    const query = searchText.toLowerCase();
    return wppList.filter(
      (item) =>
        item.code.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }, [wppList, searchText]);

  // Handle submit form TAMBAH data
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newDescription.trim()) return;

    setIsSubmitting(true);
    try {
      await createWpp(newCode, newDescription);
      setToastMessage("Data WPP berhasil ditambahkan");
      setNewCode("");
      setNewDescription("");
      setIsModalOpen(false);
      fetchWpp(); // Refresh data tabel
    } catch (err: any) {
      const errMsg = err.response?.data?.error || "Gagal menyimpan data WPP";
      alert(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi membuka modal EDIT dan isi form dengan data lama
  const openEditModal = (item: Wpp) => {
    setEditingId(item.id);
    setEditCode(item.code);
    setEditDescription(item.description);
    setIsEditModalOpen(true);
  };

  // Handle submit form EDIT data
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editCode.trim() || !editDescription.trim()) return;

    setIsEditing(true);
    try {
      await editWpp(editingId, editCode, editDescription);
      setToastMessage("Data WPP berhasil diperbarui");
      setIsEditModalOpen(false);
      fetchWpp(); // Refresh data tabel
    } catch (err: any) {
      const errMsg = err.response?.data?.error || "Gagal memperbarui data WPP";
      alert(errMsg);
    } finally {
      setIsEditing(false);
    }
  };

  // Handle konfirmasi HAPUS data
  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteWpp(deletingId);
      setToastMessage("Data WPP berhasil dihapus");
      fetchWpp(); // Refresh data tabel
    } catch (err: any) {
      const errMsg = err.response?.data?.error || "Gagal menghapus data WPP";
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
          placeholder="Cari kode atau deskripsi WPP..."
          className="wpp-searchbar"
        />

        <div className="wpp-header-container">
          <h2 className="wpp-title">
            Data WPP Zone
          </h2>
          <IonButton onClick={() => setIsModalOpen(true)}>
            <IonIcon slot="start" icon={addOutline} />
            Tambah Data
          </IonButton>
        </div>

        {loading ? (
          <div className="wpp-loading-container">
            <IonSpinner name="crescent" />
            <p><IonText color="medium">Memuat data...</IonText></p>
          </div>
        ) : error ? (
          <div className="wpp-message-container">
            <IonText color="danger">{error}</IonText>
          </div>
        ) : filteredWpp.length === 0 ? (
          <div className="wpp-message-container">
            <IonText color="medium">Data WPP tidak ditemukan.</IonText>
          </div>
        ) : (
          <div className="wpp-table-wrapper">
            <table className="wpp-table">
              <thead>
                <tr className="wpp-table-header-row">
                  <th className="wpp-table-th">No</th>
                  <th className="wpp-table-th">Kode</th>
                  <th className="wpp-table-th">Deskripsi</th>
                  <th className="wpp-table-th wpp-text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredWpp.map((item, index) => (
                  <tr key={item.id} className="wpp-table-row">
                    <td className="wpp-table-td">{index + 1}</td>
                    <td className="wpp-table-td">
                      <IonBadge color="primary">{item.code}</IonBadge>
                    </td>
                    <td className="wpp-table-td">{item.description}</td>
                    <td className="wpp-table-td wpp-text-center">
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
            <IonTitle>Tambah Data WPP</IonTitle>
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
              <IonLabel position="stacked">Kode WPP</IonLabel>
              <IonInput
                value={newCode}
                placeholder="Contoh: 711"
                onIonInput={(e) => setNewCode(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem className="wpp-form-item">
              <IonLabel position="stacked">Deskripsi</IonLabel>
              <IonInput
                value={newDescription}
                placeholder="Contoh: Perairan Selat Karimata"
                onIonInput={(e) => setNewDescription(e.detail.value!)}
                required
              />
            </IonItem>
            <div className="wpp-form-actions">
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
            <IonTitle>Edit Data WPP</IonTitle>
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
              <IonLabel position="stacked">Kode WPP</IonLabel>
              <IonInput
                value={editCode}
                placeholder="Contoh: 711"
                onIonInput={(e) => setEditCode(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem className="wpp-form-item">
              <IonLabel position="stacked">Deskripsi</IonLabel>
              <IonInput
                value={editDescription}
                placeholder="Contoh: Perairan Selat Karimata"
                onIonInput={(e) => setEditDescription(e.detail.value!)}
                required
              />
            </IonItem>
            <div className="wpp-form-actions">
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
        message="Apakah Anda yakin ingin menghapus data WPP ini?"
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

export default WppZonePage;