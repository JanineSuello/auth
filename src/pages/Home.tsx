import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent
} from '@ionic/react';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isMal, setIsMal] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');
  const history = useHistory();

  const checkLink = async () => {
    const blacklist = ['phishing', 'malware', 'clickbait', 'suspicious', 'bin', 'hex', '12345', 'virus', 'random', 'blocked', 'malicious', 'cyber', 'Mozi'];
    const isMalicious = blacklist.some((kw) => url.toLowerCase().includes(kw));
    setIsMal(isMalicious);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const user = session?.user;
      if (!user) {
        setMessage('User not logged in');
        return;
      }

      const { data: userData, error: userFetchError } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_email', user.email)
        .single();

      if (userFetchError) throw userFetchError;

      const userId = userData.user_id;

      const { error: insertError } = await supabase.from('checked_urls').insert([
        {
          user_id: userId,
          url,
          is_malicious: isMalicious,
        },
      ]);

      if (insertError) throw insertError;

      setMessage('URL check saved.');
    } catch (err: any) {
      console.error(err);
      setMessage('Error saving URL check.');
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      history.push('/login');
    } else {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
          <IonButton slot="end" fill="clear" onClick={logout}>
            Logout
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" fullscreen>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: '1rem',
        }}>
          <IonCard style={{ width: '100%', maxWidth: 480 }}>
            <IonCardContent>
              <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>🔍 Link Checker</h2>

              <IonInput
                placeholder="Enter URL"
                value={url}
                onIonChange={(e) => setUrl(e.detail.value!)}
                className="ion-margin-vertical"
              />

              <IonButton expand="block" onClick={checkLink} className="ion-margin-top">
                Check
              </IonButton>

              {isMal !== null && (
                <IonText color={isMal ? 'danger' : 'success'}>
                  <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                    {isMal ? '⚠️ Malicious!' : '✅ Safe'}
                  </p>
                </IonText>
              )}

              {message && (
                <IonText color="medium">
                  <p style={{ textAlign: 'center', marginTop: '0.5rem' }}>{message}</p>
                </IonText>
              )}
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
