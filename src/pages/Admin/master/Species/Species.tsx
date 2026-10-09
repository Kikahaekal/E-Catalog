import React, { useEffect, useState, useMemo } from "react";
import {
  IonSearchbar, IonButton, IonIcon, IonModal, IonHeader,
  IonToolbar, IonTitle, IonContent, IonItem, IonLabel,
  IonInput, IonSpinner, IonText, IonBadge, IonButtons,
  IonToast, IonAlert, IonSelect, IonSelectOption
} from "@ionic/react";
import { addOutline, closeOutline, eyeOutline, pencilOutline, trashOutline } from "ionicons/icons";
import { AdminLayout } from "../../../../layout/AdminLayout";
import { AdminRecordDetails } from "../../../../components/AdminRecordDetails";
import { getAllSpecies, createSpecies, editSpecies, deleteSpecies, Species, SpeciesPayload } from "../../../../services/species"; 
import { getAllIucn, Iucn } from "../../../../services/iucn"; 
import { getAllReferences, Reference } from "../../../../services/reference"; 
import { getAllRegencies } from "../../../../services/regency"; 
import { getAllWpp } from "../../../../services/wpp"; 
import "./Species.css"; 

const SpeciesPage: React.FC = () => {
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [iucnList, setIucnList] = useState<Iucn[]>([]);
  const [referenceList, setReferenceList] = useState<Reference[]>([]);
  const [regencyList, setRegencyList] = useState<any[]>([]);
  const [wppList, setWppList] = useState<any[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [detailItem, setDetailItem] = useState<Species | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [commonName, setCommonName] = useState<string>("");
  const [scientificName, setScientificName] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [etymology, setEtymology] = useState<string>("");
  const [order, setOrder] = useState<string>("");
  const [family, setFamily] = useState<string>("");
  const [genus, setGenus] = useState<string>("");
  const [environment, setEnvironment] = useState<string>("");
  const [climateZone, setClimateZone] = useState<string>("");
  const [depthMinMeters, setDepthMinMeters] = useState<string>("");
  const [depthMaxMeters, setDepthMaxMeters] = useState<string>("");
  const [tempMinC, setTempMinC] = useState<string>("");
  const [tempMaxC, setTempMaxC] = useState<string>("");
  const [distributionText, setDistributionText] = useState<string>("");
  const [maxLengthCm, setMaxLengthCm] = useState<string>("");
  const [lengthType, setLengthType] = useState<string>("");
  const [maxWeightKg, setMaxWeightKg] = useState<string>("");
  const [maxAgeYears, setMaxAgeYears] = useState<string>("");
  const [dorsalSpines, setDorsalSpines] = useState<string>("");
  const [dorsalSoftRays, setDorsalSoftRays] = useState<string>("");
  const [analSpines, setAnalSpines] = useState<string>("");
  const [analSoftRays, setAnalSoftRays] = useState<string>("");
  const [bodyShape, setBodyShape] = useState<string>("");
  const [morphologyText, setMorphologyText] = useState<string>("");
  const [biologyText, setBiologyText] = useState<string>("");
  const [fecundityText, setFecundityText] = useState<string>("");
  const [threatToHumans, setThreatToHumans] = useState<string>("");
  const [fisheriesImportance, setFisheriesImportance] = useState<string>("");
  const [isGamefish, setIsGamefish] = useState<boolean>(false);
  const [iucnStatusId, setIucnStatusId] = useState<string | number>("");
  const [iucnAssessedAt, setIucnAssessedAt] = useState<string>("");
  const [citesStatus, setCitesStatus] = useState<string>("");
  const [cmsStatus, setCmsStatus] = useState<string>("");
  const [synonyms, setSynonyms] = useState<Array<{ scientificName: string; author: string; status: string }>>([]);
  const [localNames, setLocalNames] = useState<Array<{ name: string; regionNote: string }>>([]);
  const [photos, setPhotos] = useState<Array<{ filePath: string; caption: string; isPrimary: boolean }>>([]);
  const [references, setReferences] = useState<Array<{ referenceId: number; isMainRef: boolean }>>([]);
  const [wppIds, setWppIds] = useState<number[]>([]);
  const [regencyIds, setRegencyIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editCommonName, setEditCommonName] = useState<string>("");
  const [editScientificName, setEditScientificName] = useState<string>("");
  const [editAuthor, setEditAuthor] = useState<string>("");
  const [editEtymology, setEditEtymology] = useState<string>("");
  const [editOrder, setEditOrder] = useState<string>("");
  const [editFamily, setEditFamily] = useState<string>("");
  const [editGenus, setEditGenus] = useState<string>("");
  const [editEnvironment, setEditEnvironment] = useState<string>("");
  const [editClimateZone, setEditClimateZone] = useState<string>("");
  const [editDepthMinMeters, setEditDepthMinMeters] = useState<string>("");
  const [editDepthMaxMeters, setEditDepthMaxMeters] = useState<string>("");
  const [editTempMinC, setEditTempMinC] = useState<string>("");
  const [editTempMaxC, setEditTempMaxC] = useState<string>("");
  const [editDistributionText, setEditDistributionText] = useState<string>("");
  const [editMaxLengthCm, setEditMaxLengthCm] = useState<string>("");
  const [editLengthType, setEditLengthType] = useState<string>("");
  const [editMaxWeightKg, setEditMaxWeightKg] = useState<string>("");
  const [editMaxAgeYears, setEditMaxAgeYears] = useState<string>("");
  const [editDorsalSpines, setEditDorsalSpines] = useState<string>("");
  const [editDorsalSoftRays, setEditDorsalSoftRays] = useState<string>("");
  const [editAnalSpines, setEditAnalSpines] = useState<string>("");
  const [editAnalSoftRays, setEditAnalSoftRays] = useState<string>("");
  const [editBodyShape, setEditBodyShape] = useState<string>("");
  const [editMorphologyText, setEditMorphologyText] = useState<string>("");
  const [editBiologyText, setEditBiologyText] = useState<string>("");
  const [editFecundityText, setEditFecundityText] = useState<string>("");
  const [editThreatToHumans, setEditThreatToHumans] = useState<string>("");
  const [editFisheriesImportance, setEditFisheriesImportance] = useState<string>("");
  const [editIsGamefish, setEditIsGamefish] = useState<boolean>(false);
  const [editIucnStatusId, setEditIucnStatusId] = useState<string | number>("");
  const [editIucnAssessedAt, setEditIucnAssessedAt] = useState<string>("");
  const [editCitesStatus, setEditCitesStatus] = useState<string>("");
  const [editCmsStatus, setEditCmsStatus] = useState<string>("");
  const [editSynonyms, setEditSynonyms] = useState<Array<{ scientificName: string; author: string; status: string }>>([]);
  const [editLocalNames, setEditLocalNames] = useState<Array<{ name: string; regionNote: string }>>([]);
  const [editPhotos, setEditPhotos] = useState<Array<{ filePath: string; caption: string; isPrimary: boolean }>>([]);
  const [editReferences, setEditReferences] = useState<Array<{ referenceId: number; isMainRef: boolean }>>([]);
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
        getAllReferences(),
        getAllRegencies(),
        getAllWpp()
      ]);
      const [speciesRes, iucnRes, referenceRes, regencyRes, wppRes] = results;

      if (speciesRes.status === "fulfilled") setSpeciesList(speciesRes.value.data || []);
      if (iucnRes.status === "fulfilled") setIucnList(iucnRes.value.data || []);
      if (referenceRes.status === "fulfilled") setReferenceList(referenceRes.value.data || []);
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
        author: author || null,
        etymology: etymology || null,
        order: order || null,
        family: family || null,
        genus: genus || null,
        environment: environment || null,
        climateZone: climateZone || null,
        depthMinMeters: depthMinMeters ? Number(depthMinMeters) : null,
        depthMaxMeters: depthMaxMeters ? Number(depthMaxMeters) : null,
        tempMinC: tempMinC ? Number(tempMinC) : null,
        tempMaxC: tempMaxC ? Number(tempMaxC) : null,
        distributionText: distributionText || null,
        maxLengthCm: maxLengthCm ? Number(maxLengthCm) : null,
        lengthType: lengthType || null,
        maxWeightKg: maxWeightKg ? Number(maxWeightKg) : null,
        maxAgeYears: maxAgeYears ? Number(maxAgeYears) : null,
        dorsalSpines: dorsalSpines || null,
        dorsalSoftRays: dorsalSoftRays || null,
        analSpines: analSpines || null,
        analSoftRays: analSoftRays || null,
        bodyShape: bodyShape || null,
        morphologyText: morphologyText || null,
        biologyText: biologyText || null,
        fecundityText: fecundityText || null,
        threatToHumans: threatToHumans || null,
        fisheriesImportance: fisheriesImportance || null,
        isGamefish,
        iucnStatusId: iucnStatusId || null,
        iucnAssessedAt: iucnAssessedAt || null,
        citesStatus: citesStatus || null,
        cmsStatus: cmsStatus || null,
        synonyms: synonyms.filter((item) => item.scientificName.trim()),
        localNames: localNames.filter((item) => item.name.trim()),
        photos: photos.filter((item) => item.filePath.trim()),
        references: references.filter((item) => item.referenceId),
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
    setEditAuthor(item.author || "");
    setEditEtymology(item.etymology || "");
    setEditOrder(item.order || "");
    setEditFamily(item.family || "");
    setEditGenus(item.genus || "");
    setEditEnvironment(item.environment || "");
    setEditClimateZone(item.climateZone || "");
    setEditDepthMinMeters(item.depthMinMeters !== null && item.depthMinMeters !== undefined ? String(item.depthMinMeters) : "");
    setEditDepthMaxMeters(item.depthMaxMeters !== null && item.depthMaxMeters !== undefined ? String(item.depthMaxMeters) : "");
    setEditTempMinC(item.tempMinC !== null && item.tempMinC !== undefined ? String(item.tempMinC) : "");
    setEditTempMaxC(item.tempMaxC !== null && item.tempMaxC !== undefined ? String(item.tempMaxC) : "");
    setEditDistributionText(item.distributionText || "");
    setEditMaxLengthCm(item.maxLengthCm !== null && item.maxLengthCm !== undefined ? String(item.maxLengthCm) : "");
    setEditLengthType(item.lengthType || "");
    setEditMaxWeightKg(item.maxWeightKg !== null && item.maxWeightKg !== undefined ? String(item.maxWeightKg) : "");
    setEditMaxAgeYears(item.maxAgeYears !== null && item.maxAgeYears !== undefined ? String(item.maxAgeYears) : "");
    setEditDorsalSpines(item.dorsalSpines || "");
    setEditDorsalSoftRays(item.dorsalSoftRays || "");
    setEditAnalSpines(item.analSpines || "");
    setEditAnalSoftRays(item.analSoftRays || "");
    setEditBodyShape(item.bodyShape || "");
    setEditMorphologyText(item.morphologyText || "");
    setEditBiologyText(item.biologyText || "");
    setEditFecundityText(item.fecundityText || "");
    setEditThreatToHumans(item.threatToHumans || "");
    setEditFisheriesImportance(item.fisheriesImportance || "");
    setEditIsGamefish(Boolean(item.isGamefish));
    setEditIucnStatusId(item.iucnStatusId ?? "");
    setEditIucnAssessedAt(item.iucnAssessedAt || "");
    setEditCitesStatus(item.citesStatus || "");
    setEditCmsStatus(item.cmsStatus || "");
    setEditSynonyms((item.synonyms || []).map((synonym) => ({
      scientificName: synonym.scientificName || "",
      author: synonym.author || "",
      status: synonym.status || "",
    })));
    setEditLocalNames((item.localNames || []).map((localName) => ({
      name: localName.name || "",
      regionNote: localName.regionNote || "",
    })));
    setEditPhotos((item.photos || []).map((photo) => ({
      filePath: photo.filePath || "",
      caption: photo.caption || "",
      isPrimary: Boolean(photo.isPrimary),
    })));
    setEditReferences((item.references || []).map((entry) => ({
      referenceId: Number(entry.referenceId ?? entry.reference?.id ?? 0),
      isMainRef: Boolean(entry.isMainRef),
    })));
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
        author: editAuthor || null,
        etymology: editEtymology || null,
        order: editOrder || null,
        family: editFamily || null,
        genus: editGenus || null,
        environment: editEnvironment || null,
        climateZone: editClimateZone || null,
        depthMinMeters: editDepthMinMeters ? Number(editDepthMinMeters) : null,
        depthMaxMeters: editDepthMaxMeters ? Number(editDepthMaxMeters) : null,
        tempMinC: editTempMinC ? Number(editTempMinC) : null,
        tempMaxC: editTempMaxC ? Number(editTempMaxC) : null,
        distributionText: editDistributionText || null,
        maxLengthCm: editMaxLengthCm ? Number(editMaxLengthCm) : null,
        lengthType: editLengthType || null,
        maxWeightKg: editMaxWeightKg ? Number(editMaxWeightKg) : null,
        maxAgeYears: editMaxAgeYears ? Number(editMaxAgeYears) : null,
        dorsalSpines: editDorsalSpines || null,
        dorsalSoftRays: editDorsalSoftRays || null,
        analSpines: editAnalSpines || null,
        analSoftRays: editAnalSoftRays || null,
        bodyShape: editBodyShape || null,
        morphologyText: editMorphologyText || null,
        biologyText: editBiologyText || null,
        fecundityText: editFecundityText || null,
        threatToHumans: editThreatToHumans || null,
        fisheriesImportance: editFisheriesImportance || null,
        isGamefish: editIsGamefish,
        iucnStatusId: editIucnStatusId || null,
        iucnAssessedAt: editIucnAssessedAt || null,
        citesStatus: editCitesStatus || null,
        cmsStatus: editCmsStatus || null,
        synonyms: editSynonyms.filter((item) => item.scientificName.trim()),
        localNames: editLocalNames.filter((item) => item.name.trim()),
        photos: editPhotos.filter((item) => item.filePath.trim()),
        references: editReferences.filter((item) => item.referenceId),
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
    setAuthor("");
    setEtymology("");
    setOrder("");
    setFamily("");
    setGenus("");
    setEnvironment("");
    setClimateZone("");
    setDepthMinMeters("");
    setDepthMaxMeters("");
    setTempMinC("");
    setTempMaxC("");
    setDistributionText("");
    setMaxLengthCm("");
    setLengthType("");
    setMaxWeightKg("");
    setMaxAgeYears("");
    setDorsalSpines("");
    setDorsalSoftRays("");
    setAnalSpines("");
    setAnalSoftRays("");
    setBodyShape("");
    setMorphologyText("");
    setBiologyText("");
    setFecundityText("");
    setThreatToHumans("");
    setFisheriesImportance("");
    setIsGamefish(false);
    setIucnStatusId("");
    setIucnAssessedAt("");
    setCitesStatus("");
    setCmsStatus("");
    setSynonyms([]);
    setLocalNames([]);
    setPhotos([]);
    setReferences([]);
    setWppIds([]);
    setRegencyIds([]);
  };

  const getIucnCode = (id?: string | number | null) => {
    if (id === undefined || id === null || id === "") return "-";
    const iucn = iucnList.find(i => String(i.id) === String(id));
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
                      <IonButton fill="clear" size="small" aria-label={`Lihat detail ${item.commonName}`} onClick={() => setDetailItem(item)}>
                        <IonIcon slot="icon-only" icon={eyeOutline} />
                      </IonButton>
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

      <AdminRecordDetails
        title="Detail Spesies"
        isOpen={detailItem !== null}
        onDismiss={() => setDetailItem(null)}
        fields={detailItem ? [
          { label: "ID", value: detailItem.id },
          { label: "Nama Umum", value: detailItem.commonName },
          { label: "Nama Ilmiah", value: <em>{detailItem.scientificName}</em> },
          { label: "Author", value: detailItem.author || "-" },
          { label: "Etimologi", value: detailItem.etymology || "-" },
          { label: "Ordo", value: detailItem.order || "-" },
          { label: "Famili", value: detailItem.family || "-" },
          { label: "Genus", value: detailItem.genus || "-" },
          { label: "Lingkungan", value: detailItem.environment || "-" },
          { label: "Zona Iklim", value: detailItem.climateZone || "-" },
          { label: "Kedalaman (m)", value: `${detailItem.depthMinMeters ?? "-"} - ${detailItem.depthMaxMeters ?? "-"}` },
          { label: "Suhu (°C)", value: `${detailItem.tempMinC ?? "-"} - ${detailItem.tempMaxC ?? "-"}` },
          { label: "Distribusi", value: detailItem.distributionText || "-" },
          { label: "Panjang Maksimum (cm)", value: detailItem.maxLengthCm ?? "-" },
          { label: "Tipe Panjang", value: detailItem.lengthType || "-" },
          { label: "Berat Maksimum (kg)", value: detailItem.maxWeightKg ?? "-" },
          { label: "Umur Maksimum (tahun)", value: detailItem.maxAgeYears ?? "-" },
          { label: "Duri Sirip Punggung", value: detailItem.dorsalSpines || "-" },
          { label: "Jari Lunak Sirip Punggung", value: detailItem.dorsalSoftRays || "-" },
          { label: "Duri Sirip Anal", value: detailItem.analSpines || "-" },
          { label: "Jari Lunak Sirip Anal", value: detailItem.analSoftRays || "-" },
          { label: "Bentuk Tubuh", value: detailItem.bodyShape || "-" },
          { label: "Morfologi", value: detailItem.morphologyText || "-" },
          { label: "Biologi", value: detailItem.biologyText || "-" },
          { label: "Fekunditas", value: detailItem.fecundityText || "-" },
          { label: "Ancaman bagi Manusia", value: detailItem.threatToHumans || "-" },
          { label: "Kepentingan Perikanan", value: detailItem.fisheriesImportance || "-" },
          { label: "Gamefish", value: detailItem.isGamefish ? "Ya" : "Tidak" },
          { label: "Status IUCN", value: detailItem.iucnStatus ? `${detailItem.iucnStatus.code} - ${detailItem.iucnStatus.name}` : getIucnCode(detailItem.iucnStatusId) },
          { label: "Tanggal Penilaian IUCN", value: detailItem.iucnAssessedAt || "-" },
          { label: "Status CITES", value: detailItem.citesStatus || "-" },
          { label: "Status CMS", value: detailItem.cmsStatus || "-" },
          { label: "Sinonim", value: detailItem.synonyms?.length ? <ul>{detailItem.synonyms.map((synonym, index) => <li key={`${synonym.scientificName}-${index}`}><em>{synonym.scientificName}</em>{synonym.author ? `, ${synonym.author}` : ""}{synonym.status ? ` (${synonym.status})` : ""}</li>)}</ul> : "-" },
          { label: "Nama Lokal", value: detailItem.localNames?.length ? <ul>{detailItem.localNames.map((localName, index) => <li key={`${localName.name || "nama"}-${index}`}>{localName.name || "-"}{localName.regionNote ? ` (${localName.regionNote})` : ""}</li>)}</ul> : "-" },
          { label: "Foto", value: detailItem.photos?.length ? <ul>{detailItem.photos.map((photo, index) => <li key={photo.id || `${photo.filePath}-${index}`}>{photo.caption || photo.filePath}{photo.isPrimary ? " (utama)" : ""}</li>)}</ul> : "-" },
          { label: "Referensi", value: detailItem.references?.length ? <ul>{detailItem.references.map((entry, index) => <li key={entry.reference?.id || entry.referenceId || index}>{entry.reference?.title || `Referensi ${entry.referenceId || ""}`}{entry.isMainRef ? " (utama)" : ""}</li>)}</ul> : "-" },
          { label: "Wilayah", value: detailItem.regencies?.length ? <ul>{detailItem.regencies.map((entry, index) => <li key={entry.regency?.id || index}>{entry.regency?.name || "-"}{entry.regency?.province ? `, ${entry.regency.province}` : ""}</li>)}</ul> : "-" },
          { label: "Zona WPP", value: detailItem.wppZones?.length ? <ul>{detailItem.wppZones.map((entry, index) => <li key={entry.wppZone?.id || index}>{entry.wppZone?.code || "-"}{entry.wppZone?.description ? `: ${entry.wppZone.description}` : ""}</li>)}</ul> : "-" },
          { label: "Dibuat", value: detailItem.createdAt || "-" },
          { label: "Diperbarui", value: detailItem.updatedAt || "-" },
        ] : []}
      />

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
            <div className="species-form-section">
              <h3>Identitas Taksonomi</h3>
              <IonItem>
                <IonLabel position="stacked">Penulis / Author</IonLabel>
                <IonInput value={author} onIonInput={(e) => setAuthor(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Etimologi</IonLabel>
                <IonInput value={etymology} onIonInput={(e) => setEtymology(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Ordo</IonLabel>
                <IonInput value={order} onIonInput={(e) => setOrder(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Famili</IonLabel>
                <IonInput value={family} onIonInput={(e) => setFamily(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Genus</IonLabel>
                <IonInput value={genus} onIonInput={(e) => setGenus(e.detail.value!)} />
              </IonItem>
            </div>

            <div className="species-form-section">
              <h3>Habitat dan Distribusi</h3>
              <IonItem>
                <IonLabel position="stacked">Lingkungan</IonLabel>
                <IonInput value={environment} onIonInput={(e) => setEnvironment(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Zona Iklim</IonLabel>
                <IonInput value={climateZone} onIonInput={(e) => setClimateZone(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Kedalaman Minimum (m)</IonLabel>
                <IonInput value={depthMinMeters} type="number" onIonInput={(e) => setDepthMinMeters(e.detail.value || "")} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Kedalaman Maksimum (m)</IonLabel>
                <IonInput value={depthMaxMeters} type="number" onIonInput={(e) => setDepthMaxMeters(e.detail.value || "")} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Suhu Minimum (°C)</IonLabel>
                <IonInput value={tempMinC} type="number" onIonInput={(e) => setTempMinC(e.detail.value || "")} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Suhu Maksimum (°C)</IonLabel>
                <IonInput value={tempMaxC} type="number" onIonInput={(e) => setTempMaxC(e.detail.value || "")} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Distribusi</IonLabel>
                <IonInput value={distributionText} onIonInput={(e) => setDistributionText(e.detail.value!)} />
              </IonItem>
            </div>

            <div className="species-form-section">
              <h3>Ukuran dan Morfologi</h3>
              <IonItem>
                <IonLabel position="stacked">Panjang Maksimum (cm)</IonLabel>
                <IonInput value={maxLengthCm} type="number" onIonInput={(e) => setMaxLengthCm(e.detail.value || "")} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Tipe Panjang</IonLabel>
                <IonInput value={lengthType} onIonInput={(e) => setLengthType(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Berat Maksimum (kg)</IonLabel>
                <IonInput value={maxWeightKg} type="number" onIonInput={(e) => setMaxWeightKg(e.detail.value || "")} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Umur Maksimum (tahun)</IonLabel>
                <IonInput value={maxAgeYears} type="number" onIonInput={(e) => setMaxAgeYears(e.detail.value || "")} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Dorsal Spines</IonLabel>
                <IonInput value={dorsalSpines} onIonInput={(e) => setDorsalSpines(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Dorsal Soft Rays</IonLabel>
                <IonInput value={dorsalSoftRays} onIonInput={(e) => setDorsalSoftRays(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Anal Spines</IonLabel>
                <IonInput value={analSpines} onIonInput={(e) => setAnalSpines(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Anal Soft Rays</IonLabel>
                <IonInput value={analSoftRays} onIonInput={(e) => setAnalSoftRays(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Bentuk Tubuh</IonLabel>
                <IonInput value={bodyShape} onIonInput={(e) => setBodyShape(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Deskripsi Morfologi</IonLabel>
                <IonInput value={morphologyText} onIonInput={(e) => setMorphologyText(e.detail.value!)} />
              </IonItem>
            </div>

            <div className="species-form-section">
              <h3>Biologi dan Konservasi</h3>
              <IonItem>
                <IonLabel position="stacked">Biologi</IonLabel>
                <IonInput value={biologyText} onIonInput={(e) => setBiologyText(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fekunditas</IonLabel>
                <IonInput value={fecundityText} onIonInput={(e) => setFecundityText(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Ancaman terhadap Manusia</IonLabel>
                <IonInput value={threatToHumans} onIonInput={(e) => setThreatToHumans(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Pentingnya dalam Perikanan</IonLabel>
                <IonInput value={fisheriesImportance} onIonInput={(e) => setFisheriesImportance(e.detail.value!)} />
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
                <IonLabel position="stacked">Tanggal Penilaian IUCN</IonLabel>
                <IonInput value={iucnAssessedAt} type="date" onIonInput={(e) => setIucnAssessedAt(e.detail.value || "")} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Status CITES</IonLabel>
                <IonInput value={citesStatus} onIonInput={(e) => setCitesStatus(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Status CMS</IonLabel>
                <IonInput value={cmsStatus} onIonInput={(e) => setCmsStatus(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Ikan Gamefish</IonLabel>
                <IonSelect value={isGamefish} onIonChange={(e) => setIsGamefish(Boolean(e.detail.value))} placeholder="Pilih status">
                  <IonSelectOption value={true}>Ya</IonSelectOption>
                  <IonSelectOption value={false}>Tidak</IonSelectOption>
                </IonSelect>
              </IonItem>
            </div>

            <div className="species-form-section">
              <h3>Sinonim</h3>
              {synonyms.map((synonym, index) => (
                <div key={index} className="species-related-row">
                  <IonItem>
                    <IonLabel position="stacked">Nama ilmiah</IonLabel>
                    <IonInput value={synonym.scientificName} onIonInput={(e) => setSynonyms((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, scientificName: e.detail.value || "" } : item))} />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Penulis</IonLabel>
                    <IonInput value={synonym.author} onIonInput={(e) => setSynonyms((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, author: e.detail.value || "" } : item))} />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Status</IonLabel>
                    <IonInput value={synonym.status} onIonInput={(e) => setSynonyms((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, status: e.detail.value || "" } : item))} />
                  </IonItem>
                  <IonButton fill="clear" color="danger" onClick={() => setSynonyms((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Hapus</IonButton>
                </div>
              ))}
              <IonButton fill="clear" onClick={() => setSynonyms((current) => [...current, { scientificName: "", author: "", status: "" }])}>Tambah Sinonim</IonButton>
            </div>

            <div className="species-form-section">
              <h3>Nama Lokal</h3>
              {localNames.map((localName, index) => (
                <div key={index} className="species-related-row">
                  <IonItem>
                    <IonLabel position="stacked">Nama</IonLabel>
                    <IonInput value={localName.name} onIonInput={(e) => setLocalNames((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, name: e.detail.value || "" } : item))} />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Catatan daerah</IonLabel>
                    <IonInput value={localName.regionNote} onIonInput={(e) => setLocalNames((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, regionNote: e.detail.value || "" } : item))} />
                  </IonItem>
                  <IonButton fill="clear" color="danger" onClick={() => setLocalNames((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Hapus</IonButton>
                </div>
              ))}
              <IonButton fill="clear" onClick={() => setLocalNames((current) => [...current, { name: "", regionNote: "" }])}>Tambah Nama Lokal</IonButton>
            </div>

            <div className="species-form-section">
              <h3>Referensi</h3>
              {references.map((reference, index) => (
                <div key={index} className="species-related-row">
                  <IonItem>
                    <IonLabel position="stacked">Referensi</IonLabel>
                    <IonSelect value={reference.referenceId} onIonChange={(e) => setReferences((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, referenceId: Number(e.detail.value) } : item))} placeholder="Pilih referensi">
                      {referenceList.map((item) => (
                        <IonSelectOption key={item.id} value={Number(item.id)}>{item.title} ({item.authors})</IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Referensi utama</IonLabel>
                    <IonSelect value={reference.isMainRef} onIonChange={(e) => setReferences((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, isMainRef: Boolean(e.detail.value) } : item))} placeholder="Pilih status">
                      <IonSelectOption value={true}>Ya</IonSelectOption>
                      <IonSelectOption value={false}>Tidak</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonButton fill="clear" color="danger" onClick={() => setReferences((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Hapus</IonButton>
                </div>
              ))}
              <IonButton fill="clear" onClick={() => setReferences((current) => [...current, { referenceId: 0, isMainRef: false }])}>Tambah Referensi</IonButton>
            </div>

            <div className="species-form-section">
              <h3>Foto</h3>
              {photos.map((photo, index) => (
                <div key={index} className="species-related-row">
                  <IonItem>
                    <IonLabel position="stacked">URL atau path foto</IonLabel>
                    <IonInput value={photo.filePath} onIonInput={(e) => setPhotos((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, filePath: e.detail.value || "" } : item))} />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Keterangan</IonLabel>
                    <IonInput value={photo.caption} onIonInput={(e) => setPhotos((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, caption: e.detail.value || "" } : item))} />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Foto utama</IonLabel>
                    <IonSelect value={photo.isPrimary} onIonChange={(e) => setPhotos((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, isPrimary: Boolean(e.detail.value) } : item))} placeholder="Pilih status">
                      <IonSelectOption value={true}>Ya</IonSelectOption>
                      <IonSelectOption value={false}>Tidak</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonButton fill="clear" color="danger" onClick={() => setPhotos((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Hapus</IonButton>
                </div>
              ))}
              <IonButton fill="clear" onClick={() => setPhotos((current) => [...current, { filePath: "", caption: "", isPrimary: false }])}>Tambah Foto</IonButton>
            </div>

            <div className="species-form-section">
              <h3>Wilayah</h3>
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
            </div>
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
            <div className="species-form-section">
              <h3>Identitas Taksonomi</h3>
              <IonItem>
                <IonLabel position="stacked">Penulis / Author</IonLabel>
                <IonInput value={editAuthor} onIonInput={(e) => setEditAuthor(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Etimologi</IonLabel>
                <IonInput value={editEtymology} onIonInput={(e) => setEditEtymology(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Ordo</IonLabel>
                <IonInput value={editOrder} onIonInput={(e) => setEditOrder(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Famili</IonLabel>
                <IonInput value={editFamily} onIonInput={(e) => setEditFamily(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Genus</IonLabel>
                <IonInput value={editGenus} onIonInput={(e) => setEditGenus(e.detail.value!)} />
              </IonItem>
            </div>

            <div className="species-form-section">
              <h3>Habitat dan Distribusi</h3>
              <IonItem>
                <IonLabel position="stacked">Lingkungan</IonLabel>
                <IonInput value={editEnvironment} onIonInput={(e) => setEditEnvironment(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Zona Iklim</IonLabel>
                <IonInput value={editClimateZone} onIonInput={(e) => setEditClimateZone(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Kedalaman Minimum (m)</IonLabel>
                <IonInput value={editDepthMinMeters} type="number" onIonInput={(e) => setEditDepthMinMeters(e.detail.value || "")} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Kedalaman Maksimum (m)</IonLabel>
                <IonInput value={editDepthMaxMeters} type="number" onIonInput={(e) => setEditDepthMaxMeters(e.detail.value || "")} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Suhu Minimum (°C)</IonLabel>
                <IonInput value={editTempMinC} type="number" onIonInput={(e) => setEditTempMinC(e.detail.value || "")} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Suhu Maksimum (°C)</IonLabel>
                <IonInput value={editTempMaxC} type="number" onIonInput={(e) => setEditTempMaxC(e.detail.value || "")} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Distribusi</IonLabel>
                <IonInput value={editDistributionText} onIonInput={(e) => setEditDistributionText(e.detail.value!)} />
              </IonItem>
            </div>

            <div className="species-form-section">
              <h3>Ukuran dan Morfologi</h3>
              <IonItem>
                <IonLabel position="stacked">Panjang Maksimum (cm)</IonLabel>
                <IonInput value={editMaxLengthCm} type="number" onIonInput={(e) => setEditMaxLengthCm(e.detail.value || "")} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Tipe Panjang</IonLabel>
                <IonInput value={editLengthType} onIonInput={(e) => setEditLengthType(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Berat Maksimum (kg)</IonLabel>
                <IonInput value={editMaxWeightKg} type="number" onIonInput={(e) => setEditMaxWeightKg(e.detail.value || "")} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Umur Maksimum (tahun)</IonLabel>
                <IonInput value={editMaxAgeYears} type="number" onIonInput={(e) => setEditMaxAgeYears(e.detail.value || "")} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Dorsal Spines</IonLabel>
                <IonInput value={editDorsalSpines} onIonInput={(e) => setEditDorsalSpines(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Dorsal Soft Rays</IonLabel>
                <IonInput value={editDorsalSoftRays} onIonInput={(e) => setEditDorsalSoftRays(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Anal Spines</IonLabel>
                <IonInput value={editAnalSpines} onIonInput={(e) => setEditAnalSpines(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Anal Soft Rays</IonLabel>
                <IonInput value={editAnalSoftRays} onIonInput={(e) => setEditAnalSoftRays(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Bentuk Tubuh</IonLabel>
                <IonInput value={editBodyShape} onIonInput={(e) => setEditBodyShape(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Deskripsi Morfologi</IonLabel>
                <IonInput value={editMorphologyText} onIonInput={(e) => setEditMorphologyText(e.detail.value!)} />
              </IonItem>
            </div>

            <div className="species-form-section">
              <h3>Biologi dan Konservasi</h3>
              <IonItem>
                <IonLabel position="stacked">Biologi</IonLabel>
                <IonInput value={editBiologyText} onIonInput={(e) => setEditBiologyText(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fekunditas</IonLabel>
                <IonInput value={editFecundityText} onIonInput={(e) => setEditFecundityText(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Ancaman terhadap Manusia</IonLabel>
                <IonInput value={editThreatToHumans} onIonInput={(e) => setEditThreatToHumans(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Pentingnya dalam Perikanan</IonLabel>
                <IonInput value={editFisheriesImportance} onIonInput={(e) => setEditFisheriesImportance(e.detail.value!)} />
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
                <IonLabel position="stacked">Tanggal Penilaian IUCN</IonLabel>
                <IonInput value={editIucnAssessedAt} type="date" onIonInput={(e) => setEditIucnAssessedAt(e.detail.value || "")} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Status CITES</IonLabel>
                <IonInput value={editCitesStatus} onIonInput={(e) => setEditCitesStatus(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Status CMS</IonLabel>
                <IonInput value={editCmsStatus} onIonInput={(e) => setEditCmsStatus(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Ikan Gamefish</IonLabel>
                <IonSelect value={editIsGamefish} onIonChange={(e) => setEditIsGamefish(Boolean(e.detail.value))} placeholder="Pilih status">
                  <IonSelectOption value={true}>Ya</IonSelectOption>
                  <IonSelectOption value={false}>Tidak</IonSelectOption>
                </IonSelect>
              </IonItem>
            </div>

            <div className="species-form-section">
              <h3>Sinonim</h3>
              {editSynonyms.map((synonym, index) => (
                <div key={index} className="species-related-row">
                  <IonItem>
                    <IonLabel position="stacked">Nama ilmiah</IonLabel>
                    <IonInput value={synonym.scientificName} onIonInput={(e) => setEditSynonyms((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, scientificName: e.detail.value || "" } : item))} />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Penulis</IonLabel>
                    <IonInput value={synonym.author} onIonInput={(e) => setEditSynonyms((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, author: e.detail.value || "" } : item))} />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Status</IonLabel>
                    <IonInput value={synonym.status} onIonInput={(e) => setEditSynonyms((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, status: e.detail.value || "" } : item))} />
                  </IonItem>
                  <IonButton fill="clear" color="danger" onClick={() => setEditSynonyms((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Hapus</IonButton>
                </div>
              ))}
              <IonButton fill="clear" onClick={() => setEditSynonyms((current) => [...current, { scientificName: "", author: "", status: "" }])}>Tambah Sinonim</IonButton>
            </div>

            <div className="species-form-section">
              <h3>Nama Lokal</h3>
              {editLocalNames.map((localName, index) => (
                <div key={index} className="species-related-row">
                  <IonItem>
                    <IonLabel position="stacked">Nama</IonLabel>
                    <IonInput value={localName.name} onIonInput={(e) => setEditLocalNames((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, name: e.detail.value || "" } : item))} />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Catatan daerah</IonLabel>
                    <IonInput value={localName.regionNote} onIonInput={(e) => setEditLocalNames((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, regionNote: e.detail.value || "" } : item))} />
                  </IonItem>
                  <IonButton fill="clear" color="danger" onClick={() => setEditLocalNames((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Hapus</IonButton>
                </div>
              ))}
              <IonButton fill="clear" onClick={() => setEditLocalNames((current) => [...current, { name: "", regionNote: "" }])}>Tambah Nama Lokal</IonButton>
            </div>

            <div className="species-form-section">
              <h3>Referensi</h3>
              {editReferences.map((reference, index) => (
                <div key={index} className="species-related-row">
                  <IonItem>
                    <IonLabel position="stacked">Referensi</IonLabel>
                    <IonSelect value={reference.referenceId} onIonChange={(e) => setEditReferences((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, referenceId: Number(e.detail.value) } : item))} placeholder="Pilih referensi">
                      {referenceList.map((item) => (
                        <IonSelectOption key={item.id} value={Number(item.id)}>{item.title} ({item.authors})</IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Referensi utama</IonLabel>
                    <IonSelect value={reference.isMainRef} onIonChange={(e) => setEditReferences((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, isMainRef: Boolean(e.detail.value) } : item))} placeholder="Pilih status">
                      <IonSelectOption value={true}>Ya</IonSelectOption>
                      <IonSelectOption value={false}>Tidak</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonButton fill="clear" color="danger" onClick={() => setEditReferences((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Hapus</IonButton>
                </div>
              ))}
              <IonButton fill="clear" onClick={() => setEditReferences((current) => [...current, { referenceId: 0, isMainRef: false }])}>Tambah Referensi</IonButton>
            </div>

            <div className="species-form-section">
              <h3>Foto</h3>
              {editPhotos.map((photo, index) => (
                <div key={index} className="species-related-row">
                  <IonItem>
                    <IonLabel position="stacked">URL atau path foto</IonLabel>
                    <IonInput value={photo.filePath} onIonInput={(e) => setEditPhotos((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, filePath: e.detail.value || "" } : item))} />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Keterangan</IonLabel>
                    <IonInput value={photo.caption} onIonInput={(e) => setEditPhotos((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, caption: e.detail.value || "" } : item))} />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Foto utama</IonLabel>
                    <IonSelect value={photo.isPrimary} onIonChange={(e) => setEditPhotos((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, isPrimary: Boolean(e.detail.value) } : item))} placeholder="Pilih status">
                      <IonSelectOption value={true}>Ya</IonSelectOption>
                      <IonSelectOption value={false}>Tidak</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonButton fill="clear" color="danger" onClick={() => setEditPhotos((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Hapus</IonButton>
                </div>
              ))}
              <IonButton fill="clear" onClick={() => setEditPhotos((current) => [...current, { filePath: "", caption: "", isPrimary: false }])}>Tambah Foto</IonButton>
            </div>

            <div className="species-form-section">
              <h3>Wilayah</h3>
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
            </div>
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