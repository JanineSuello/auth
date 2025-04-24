import {
  IonPage, IonContent, IonInput, IonButton,
  IonModal, IonToolbar, IonTitle, IonCard, IonCardHeader,
  IonCardSubtitle, IonCardTitle, IonText, IonCardContent
} from '@ionic/react';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import bcrypt from 'bcryptjs';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [verif, setVerif]       = useState(false);
  const [succ, setSucc]         = useState(false);
  const [alert, setAlert]       = useState<string|null>(null);

  const openVerif = () => {
    if (password !== confirm) {
      setAlert('Passwords do not match.');
      return;
    }
    setAlert(null);
    setVerif(true);
  };

  const doRegister = async () => {
    setVerif(false);
    try {
      const { error: signErr } = await supabase.auth.signUp({ email, password });
      if (signErr) throw signErr;

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const { error: dbErr } = await supabase.from('users').insert([
        { username, user_email: email, user_password: hash },
      ]);
      if (dbErr) throw dbErr;

      setSucc(true);
    } catch (e: any) {
      setAlert(e.message);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
          <IonCard style={{ width: '100%', maxWidth: 400 }}>
            <IonCardContent>
              <h2 style={{ textAlign: 'center' }}>Register</h2>
              <IonInput
                placeholder="Username"
                value={username}
                onIonChange={e => setUsername(e.detail.value!)}
                className="ion-margin-vertical"
              />
              <IonInput
                placeholder="Email"
                type="email"
                value={email}
                onIonChange={e => setEmail(e.detail.value!)}
                className="ion-margin-vertical"
              />
              <IonInput
                placeholder="Password"
                type="password"
                value={password}
                onIonChange={e => setPassword(e.detail.value!)}
                className="ion-margin-vertical"
              />
              <IonInput
                placeholder="Confirm Password"
                type="password"
                value={confirm}
                onIonChange={e => setConfirm(e.detail.value!)}
                className="ion-margin-vertical"
              />
              {alert && (
                <IonText color="danger" className="ion-margin-bottom">
                  <p>{alert}</p>
                </IonText>
              )}
              <IonButton expand="block" onClick={openVerif} className="ion-margin-top">
                Register
              </IonButton>
              <IonButton expand="block" fill="clear" routerLink="/login">
                Already have an account?
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Verification Modal */}
        <IonModal isOpen={verif} onDidDismiss={() => setVerif(false)}>
          <IonToolbar><IonTitle>Confirm Details</IonTitle></IonToolbar>
          <IonContent className="ion-padding">
            <IonCard>
              <IonCardHeader>
                <IonCardSubtitle>Username</IonCardSubtitle>
                <IonCardTitle>{username}</IonCardTitle>
                <IonCardSubtitle>Email</IonCardSubtitle>
                <IonCardTitle>{email}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonButton expand="block" color="medium" onClick={() => setVerif(false)}>Cancel</IonButton>
                <IonButton expand="block" color="primary" onClick={doRegister}>Confirm</IonButton>
              </IonCardContent>
            </IonCard>
          </IonContent>
        </IonModal>

        {/* Success Modal */}
        <IonModal isOpen={succ} onDidDismiss={() => setSucc(false)}>
          <IonContent className="ion-padding ion-text-center">
            <IonTitle>Success 🎉</IonTitle>
            <p>Your account has been created.</p>
            <IonButton routerLink="/login">Go to Login</IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Register;
