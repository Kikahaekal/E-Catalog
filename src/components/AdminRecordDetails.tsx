import React, { ReactNode } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import "./AdminRecordDetails.css";

export interface AdminDetailField {
  label: string;
  value: ReactNode;
}

interface AdminRecordDetailsProps {
  title: string;
  isOpen: boolean;
  fields: AdminDetailField[];
  onDismiss: () => void;
}

export const AdminRecordDetails: React.FC<AdminRecordDetailsProps> = ({
  title,
  isOpen,
  fields,
  onDismiss,
}) => (
  <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
    <IonHeader>
      <IonToolbar>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
          <IonButton aria-label="Tutup detail" onClick={onDismiss}>
            <IonIcon icon={closeOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      <dl className="admin-record-details">
        {fields.map((field) => (
          <div className="admin-record-details-row" key={field.label}>
            <dt>{field.label}</dt>
            <dd>{field.value ?? "-"}</dd>
          </div>
        ))}
      </dl>
    </IonContent>
  </IonModal>
);