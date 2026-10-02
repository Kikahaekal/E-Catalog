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
import { getAllIucn, createIucn, editIucn, deleteIucn, Iucn } from "../../../../services/iucn"; 
import "./Iucn.css"; 

const IucnPage: React.FC = () => {
  const [iucnList, setIucnList] = useState<Iucn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");

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
    } catch (err: any) {
      console.error("Gagal mengambil data IUCN:", err);
      const errorMessage =
        err.response?.data?.error || "Gagal memuat data IUCN dari server.";
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
    } catch (err: any) {
      const errMsg = err.response?.data?.error || "Gagal menyimpan data IUCN";
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
    } catch (err: any) {
      const errMsg = err.response?.data?.error || "Gagal memperbarui data IUCN";
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
    } catch (err: any) {
      const errMsg = err.response?.data?.error || "Gagal menghapus data IUCN (mungkin sedang digunakan)";
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
          placeholder="Cari kode atau nama IUCN..."
          className="iucn-searchbar"
        />

        <div className="iucn-header-container">
          <h2 className="iucn-title">
            Data IUCN
          </h2>
          <IonButton onClick={() => setIsModalOpen(true)}>
            <IonIcon slot="start" icon={addOutline} />
            Tambah Data
          </IonButton>
        </div>

        {loading ? (
          <div className="iucn-loading-container">
            <IonSpinner name="crescent" />
            <p><IonText color="medium">Memuat data...</IonText></p>
          </div>
        ) : error ? (
          <div className="iucn-message-container">
            <IonText color="danger">{error}</IonText>
          </div>
        ) : filteredIucn.length === 0 ? (
          <div className="iucn-message-container">
            <IonText color="medium">Data IUCN tidak ditemukan.</IonText>
          </div>
        ) : (
          <div className="iucn-table-wrapper">
            <table className="iucn-table">
              <thead>
                <tr className="iucn-table-header-row">
                  <th className="iucn-table-th">No</th>
                  <th className="iucn-table-th">Kode</th>
                  <th className="iucn-table-th">Nama Status</th>
                  <th className="iucn-table-th iucn-text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredIucn.map((item, index) => (
                  <tr key={item.id} className="iucn-table-row">
                    <td className="iucn-table-td">{index + 1}</td>
                    <td className="iucn-table-td">
                      <IonBadge color="primary">{item.code}</IonBadge>
                    </td>
                    <td className="iucn-table-td">{item.name}</td>
                    <td className="iucn-table-td iucn-text-center">
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
            <IonTitle>Tambah Data IUCN</IonTitle>
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
              <IonLabel position="stacked">Kode IUCN</IonLabel>
              <IonInput
                value={newCode}
                placeholder="Contoh: CR, EN, VU"
                onIonInput={(e) => setNewCode(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem className="iucn-form-item">
              <IonLabel position="stacked">Nama Status</IonLabel>
              <IonInput
                value={newName}
                placeholder="Contoh: Critically Endangered"
                onIonInput={(e) => setNewName(e.detail.value!)}
                required
              />
            </IonItem>
            <div className="iucn-form-actions">
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
            <IonTitle>Edit Data IUCN</IonTitle>
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
              <IonLabel position="stacked">Kode IUCN</IonLabel>
              <IonInput
                value={editCode}
                placeholder="Contoh: CR, EN, VU"
                onIonInput={(e) => setEditCode(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem className="iucn-form-item">
              <IonLabel position="stacked">Nama Status</IonLabel>
              <IonInput
                value={editName}
                placeholder="Contoh: Critically Endangered"
                onIonInput={(e) => setEditName(e.detail.value!)}
                required
              />
            </IonItem>
            <div className="iucn-form-actions">
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