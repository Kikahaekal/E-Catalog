import React, { useState } from 'react';
import { isAdminRole } from '../utils/roles';
import { IonPage, IonContent, useIonRouter } from "@ionic/react";
import { authUser } from '../services/user';
import { getApiErrorMessage } from '../utils/apiErrors';
import './Login.css';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useIonRouter();

    const handleLogin = async () => {
        try {
            const data = await authUser(email, password);
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            window.dispatchEvent(new Event('admin-auth-changed'));

            if (isAdminRole(data.role)) {
                router.push('/admin', 'forward', 'replace');
            } else {
                router.push('/home', 'forward', 'replace');
            }
        } catch (error: unknown) {
            const msg = getApiErrorMessage(error, "Login gagal. Silakan coba lagi.");
            alert(msg);
        }
    };

    return (
        <IonPage className="login-page">
            <IonContent className="login-page__content" fullscreen>
                <main className="login-page__stage">
                    <section className="login-page__panel" aria-labelledby="login-title">
                        <aside className="login-page__welcome" aria-label="E-Catalog Team">
                            <div className="login-page__brand">
                                <p className="login-page__greeting">Welcome!</p>
                                <p className="login-page__wordmark">E-Catalog</p>
                                <p className="login-page__team">Team</p>
                            </div>
                        </aside>
                        <form
                            className="login-page__form"
                            noValidate
                            onSubmit={(event) => {
                                event.preventDefault();
                                void handleLogin();
                            }}
                        >
                            <header className="login-page__heading">
                                <h1 id="login-title">Log In</h1>
                                <p>Masuk menggunakan akun administrator untuk mengelola website E-Catalog.</p>
                            </header>
                            <div className="login-page__fields">
                                <div className="login-page__field">
                                    <label htmlFor="login-email">Email Pengguna</label>
                                    <input
                                        id="login-email"
                                        name="email"
                                        type="email"
                                        autoComplete="username"
                                        placeholder="Masukkan Email Pengguna"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                    />
                                </div>
                                <div className="login-page__field">
                                    <label htmlFor="login-password">Kata Sandi</label>
                                    <div className="login-page__password">
                                        <input
                                            id="login-password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="current-password"
                                            placeholder="Masukkan Kata sandi"
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                        />
                                        <button
                                            className="login-page__visibility"
                                            type="button"
                                            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                            aria-pressed={showPassword}
                                            aria-controls="login-password"
                                            onClick={() => setShowPassword((visible) => !visible)}
                                        >
                                            <img src="/assets/login-eye-slash.svg" alt="" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button className="login-page__submit" type="submit">Masuk</button>
                        </form>
                    </section>
                </main>
            </IonContent>
        </IonPage>
    );
};

export default LoginPage;
