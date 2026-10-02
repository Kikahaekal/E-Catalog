import React, { useEffect, useState, useMemo } from "react";
import {
  IonSearchbar, IonButton, IonIcon, IonModal, IonHeader,
  IonToolbar, IonTitle, IonContent, IonItem, IonLabel,
  IonInput, IonSpinner, IonText, IonBadge, IonButtons,
  IonToast, IonAlert, IonSelect, IonSelectOption
} from "@ionic/react";
import { addOutline, closeOutline, pencilOutline, trashOutline } from "ionicons/icons";
import { AdminLayout } from "../../../../layout/AdminLayout";
import { getAllSpecies, createSpecies, editSpecies, deleteSpecies, Species, SpeciesPayload } from "../../../../services/species"; 
import { getAllIucn, Iucn } from "../../../../services/iucn"; 
import { getAllRegencies } from "../../../../services/regency"; 
import { getAllWpp } from "../../../../services/wpp"; 
import "./Species.css"; 

const SpeciesPage: React.FC = () => {
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [iucnList, setIucnList] = useState<Iucn[]>([]);
  const [regencyList, setRegencyList] = useState<any[]>([]);
  const [wppList, setWppList] = useState<any[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [commonName, setCommonName] = useState<string>("");
  const [scientificName, setScientificName] = useState<string>("");
  const [iucnStatusId, setIucnStatusId] = useState<string | number>("");
  const [wppIds, setWppIds] = useState<number[]>([]);
  const [regencyIds, setRegencyIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editCommonName, setEditCommonName] = useState<string>("");
  const [editScientificName, setEditScientificName] = useState<string>("");
  const [editIucnStatusId, setEditIucnStatusId] = useState<string | number>("");
  const [editWppIds, setEditWppIds] = useState<number[]>([]);
  const [editRegencyIds, setEditRegencyIds] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [isAlertDeleteOpen, setIsAlertDeleteOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const [toastMessage, setToastMessage] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled([
        getAllSpecies(),
        getAllIucn(),
        getAllRegencies(),
        getAllWpp()
      ]);
      const [speciesRes, iucnRes, regencyRes, wppRes] = results;

      if (speciesRes.status === "fulfilled") setSpeciesList(speciesRes.value.data || []);
      if (iucnRes.status === "fulfilled") setIucnList(iucnRes.value.data || []);
      if (regencyRes.status === "fulfilled") setRegencyList(regencyRes.value.data || []);
      if (wppRes.status === "fulfilled") setWppList(wppRes.value.data || []);

      const failedRequest = results.find((result) => result.status === "rejected");
      if (failedRequest?.status === "rejected") throw failedRequest.reason;
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal memuat data dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSpecies = useMemo(() => {
    if (!searchText.trim()) return speciesList;
    const query = searchText.toLowerCase();
    return speciesList.filter(
      (item) =>
        item.commonName.toLowerCase().includes(query) ||
        item.scientificName.toLowerCase().includes(query)
    );
  }, [speciesList, searchText]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commonName.trim() || !scientificName.trim() || !iucnStatusId) return;

    setIsSubmitting(true);
    try {
      const payload: SpeciesPayload = {
        commonName,
        scientificName,
        iucnStatusId,
        wppIds,
        regencyIds
      };
      await createSpecies(payload);
      setToastMessage("Data Spesies berhasil ditambahkan");
      resetForm();
      setIsModalOpen(false);
      fetchData(); 
    } catch (err: any) {
      alert(err.response?.data?.error || "Gagal menyimpan data Spesies");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (item: Species) => {
    setEditingId(item.id);
    setEditCommonName(item.commonName);
    setEditScientificName(item.scientificName);
    setEditIucnStatusId(item.iucnStatusId);
    
    // Asumsi relasi mereturn ID dalam objek nested, sesuaikan jika format response berbeda
    setEditWppIds(item.wppZones?.map((w: any) => w.wppZoneId || w.id) || []);
    setEditRegencyIds(item.regencies?.map((r: any) => r.regencyId || r.id) || []);
    
    setIsEditModalOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editCommonName.trim() || !editScientificName.trim() || !editIucnStatusId) return;

    setIsEditing(true);
    try {
      const payload: SpeciesPayload = {
        commonName: editCommonName,
        scientificName: editScientificName,
        iucnStatusId: editIucnStatusId,
        wppIds: editWppIds,
        regencyIds: editRegencyIds
      };
      await editSpecies(editingId, payload);
      setToastMessage("Data Spesies berhasil diperbarui");
      setIsEditModalOpen(false);
      fetchData(); 
    } catch (err: any) {
      alert(err.response?.data?.error || "Gagal memperbarui data Spesies");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteSpecies(deletingId);
      setToastMessage("Data Spesies berhasil dihapus");
      fetchData(); 
    } catch (err: any) {
      alert(err.response?.data?.error || "Gagal menghapus data Spesies");
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setCommonName("");
    setScientificName("");
    setIucnStatusId("");
    setWppIds([]);
    setRegencyIds([]);
  };

  const getIucnCode = (id: string | number) => {
    const iucn = iucnList.find(i => i.id === id);
    return iucn ? iucn.code : "-";
  };

  return (
    <AdminLayout>
      <div className="ion-padding">
        <IonSearchbar
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value!)}
          placeholder="Cari nama spesies..."
          className="species-searchbar"
        />

        <div className="species-header-container">
          <h2 className="species-title">Data Spesies</h2>
          <IonButton onClick={() => setIsModalOpen(true)}>
            <IonIcon slot="start" icon={addOutline} />
            Tambah Data
          </IonButton>
        </div>

        {loading ? (
          <div className="species-loading-container">
            <IonSpinner name="crescent" />
            <p><IonText color="medium">Memuat data...</IonText></p>
          </div>
        ) : error ? (
          <div className="species-message-container">
            <IonText color="danger">{error}</IonText>
          </div>
        ) : filteredSpecies.length === 0 ? (
          <div className="species-message-container">
            <IonText color="medium">Data Spesies tidak ditemukan.</IonText>
          </div>
        ) : (
          <div className="species-table-wrapper">
            <table className="species-table">
              <thead>
                <tr className="species-table-header-row">
                  <th className="species-table-th">No</th>
                  <th className="species-table-th">Nama Umum</th>
                  <th className="species-table-th">Nama Ilmiah</th>
                  <th className="species-table-th">Status IUCN</th>
                  <th className="species-table-th species-text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSpecies.map((item, index) => (
                  <tr key={item.id} className="species-table-row">
                    <td className="species-table-td">{index + 1}</td>
                    <td className="species-table-td">{item.commonName}</td>
                    <td className="species-table-td"><em>{item.scientificName}</em></td>
                    <td className="species-table-td">
                      <IonBadge color="primary">{getIucnCode(item.iucnStatusId)}</IonBadge>
                    </td>
                    <td className="species-table-td species-text-center">
                      <IonButton fill="clear" size="small" color="warning" onClick={() => openEditModal(item)}>
                        <IonIcon slot="icon-only" icon={pencilOutline} />
                      </IonButton>
                      <IonButton fill="clear" size="small" color="danger" onClick={() => {
                          setDeletingId(item.id);
                          setIsAlertDeleteOpen(true);
                      }}>
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
            <IonTitle>Tambah Data Spesies</IonTitle>
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
              <IonLabel position="stacked">Nama Umum</IonLabel>
              <IonInput value={commonName} onIonInput={(e) => setCommonName(e.detail.value!)} required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Nama Ilmiah</IonLabel>
              <IonInput value={scientificName} onIonInput={(e) => setScientificName(e.detail.value!)} required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Status IUCN</IonLabel>
              <IonSelect value={iucnStatusId} onIonChange={(e) => setIucnStatusId(e.detail.value)} placeholder="Pilih IUCN">
                {iucnList.map(iucn => (
                  <IonSelectOption key={iucn.id} value={iucn.id}>{iucn.code} - {iucn.name}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Wilayah WPP</IonLabel>
              <IonSelect multiple={true} value={wppIds} onIonChange={(e) => setWppIds(e.detail.value)} placeholder="Pilih WPP">
                {wppList.map(wpp => (
                  <IonSelectOption key={wpp.id} value={wpp.id}>{wpp.code}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem className="species-form-item">
              <IonLabel position="stacked">Kabupaten/Kota</IonLabel>
              <IonSelect multiple={true} value={regencyIds} onIonChange={(e) => setRegencyIds(e.detail.value)} placeholder="Pilih Wilayah">
                {regencyList.map(reg => (
                  <IonSelectOption key={reg.id} value={reg.id}>{reg.name}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <div className="species-form-actions">
              <IonButton fill="clear" color="medium" onClick={() => setIsModalOpen(false)}>Batal</IonButton>
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
            <IonTitle>Edit Data Spesies</IonTitle>
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
              <IonLabel position="stacked">Nama Umum</IonLabel>
              <IonInput value={editCommonName} onIonInput={(e) => setEditCommonName(e.detail.value!)} required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Nama Ilmiah</IonLabel>
              <IonInput value={editScientificName} onIonInput={(e) => setEditScientificName(e.detail.value!)} required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Status IUCN</IonLabel>
              <IonSelect value={editIucnStatusId} onIonChange={(e) => setEditIucnStatusId(e.detail.value)} placeholder="Pilih IUCN">
                {iucnList.map(iucn => (
                  <IonSelectOption key={iucn.id} value={iucn.id}>{iucn.code} - {iucn.name}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Wilayah WPP</IonLabel>
              <IonSelect multiple={true} value={editWppIds} onIonChange={(e) => setEditWppIds(e.detail.value)} placeholder="Pilih WPP">
                {wppList.map(wpp => (
                  <IonSelectOption key={wpp.id} value={wpp.id}>{wpp.code}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem className="species-form-item">
              <IonLabel position="stacked">Kabupaten/Kota</IonLabel>
              <IonSelect multiple={true} value={editRegencyIds} onIonChange={(e) => setEditRegencyIds(e.detail.value)} placeholder="Pilih Wilayah">
                {regencyList.map(reg => (
                  <IonSelectOption key={reg.id} value={reg.id}>{reg.name}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <div className="species-form-actions">
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
        message="Apakah Anda yakin ingin menghapus data Spesies ini?"
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

export default SpeciesPage;