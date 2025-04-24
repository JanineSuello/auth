import {
  IonPage, IonContent, IonInput, IonButton, IonText, IonCard, IonCardContent
} from '@ionic/react';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useHistory } from 'react-router';

const Login: React.FC = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr]           = useState<string|null>(null);
  const history = useHistory();

  const doLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErr(error.message);
    else history.push('/home');
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
              <h2 style={{ textAlign: 'center' }}>Login</h2>
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
              {err && (
                <IonText color="danger" className="ion-margin-bottom">
                  <p>{err}</p>
                </IonText>
              )}
              <IonButton expand="block" onClick={doLogin} className="ion-margin-top">
                Login
              </IonButton>
              <IonButton expand="block" fill="clear" routerLink="/register">
                Create account
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
