import React, { useState } from 'react';
import { IonCard, IonItem, IonInput, IonCardTitle, IonCardSubtitle, IonButton, useIonRouter } from "@ionic/react";
import { authUser } from '../services/user';
import './Login.css';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useIonRouter();

    const handleLogin = async () => {
        try {
            const data = await authUser(email, password);
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            window.dispatchEvent(new Event('admin-auth-changed'));

            if (data.role === 'admin') {
                router.push('/admin', 'forward', 'replace');
            } else {
                router.push('/home', 'forward', 'replace');
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Login gagal";
            alert(msg);
        }
    };

    return (
        <div className="form">
            <IonCard className="form-card ion-padding">
                <div className="form-item">
                    <IonCardTitle>Login</IonCardTitle>
                    <IonCardSubtitle className="ion-margin-bottom ion-margin-top">Masukkan data anda</IonCardSubtitle>
                    <IonItem>
                        <IonInput 
                            label="Email" 
                            type="email" 
                            labelPlacement="floating"
                            value={email}
                            onIonInput={(e) => setEmail(e.detail.value!)}
                        />
                    </IonItem>
                    <IonItem>
                        <IonInput 
                            label="Password" 
                            type="password" 
                            labelPlacement="floating"
                            value={password}
                            onIonInput={(e) => setPassword(e.detail.value!)}
                        />
                    </IonItem>
                    <IonButton className="btn-login" onClick={handleLogin}>Kirim</IonButton>
                </div>
            </IonCard>
        </div>
    );
};

export default LoginPage;