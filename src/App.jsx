// Importando funções específicas de diversos pacotes.
import { getAuth } from "firebase/auth"; // Para autenticação Firebase.
import { addDoc, collection, limit, orderBy, query, serverTimestamp } from "firebase/firestore"; // Para trabalhar com o Firestore (banco de dados do Firebase).
import { useRef, useState } from "react"; // Hooks do React para manipular referências e estado.
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth"; // Hooks que facilitam o uso do Firebase com o React.
import { useCollectionData } from "react-firebase-hooks/firestore"; // Hook que facilita a recuperação de dados do Firestore.
import "./global.css"; // Importando estilos globais.
import { app, databaseApp } from "./services/firebaseConfig"; // Importando a configuração do Firebase.]
// MATERIAL UI
import { Typography, Button, Box, TextField, Card, CardActionArea } from "@mui/material";
// MATERIAL ICONS
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LogoutIcon from '@mui/icons-material/Logout';
import SendIcon from '@mui/icons-material/Send'
import GoogleIcon from '@mui/icons-material/Google';

const auth = getAuth(app); // Iniciando o serviço de autenticação do Firebase.

// O componente principal da aplicação. 
export const App = () => {
  const [user] = useAuthState(auth); // Verificando o estado de autenticação do usuário.

  // Se o usuário estiver autenticado, renderiza o ChatRoom, senão, renderiza a tela de SignIn.
  return (
    <div className='App'>
      <header>
         <Typography variant="h4">LiveChat <QuestionAnswerIcon/></Typography>
          <SignOut />
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
};

// Componente de sala de chat.
export const ChatRoom = () => {
  const dummy = useRef(); // Referência que será usada para rolagem automática.
  const messagesRef = collection(databaseApp, "messages"); // Referência à coleção "messages" no Firestore.
  const q = query(messagesRef, orderBy("createdAt"), limit(25)); // Criando uma query para buscar as últimas 25 mensagens ordenadas por data de criação.
  const [messages] = useCollectionData(q, { idField: "id" }); // Usando o hook useCollectionData para obter os dados da query.

  const [formValue, setFormValue] = useState(""); // Estado para armazenar o valor do campo de texto.
  
  // Função para enviar a mensagem.
  const sendMessage = async (e) => {
    e.preventDefault();
    const { photoURL, uid, displayName } = auth.currentUser; // Adicionamos displayName aqui.
  
    await addDoc(messagesRef, {
      text: formValue,
      uid,
      photoURL,
      createdAt: serverTimestamp(),
      displayName // Adicionamos displayName aqui.
    });
    setFormValue('');
    dummy.current.scrollIntoView({behavior: 'smooth'});
  };
  

  // Renderizando as mensagens e o formulário de envio.
  return (
    <>
      <main>
        {messages && messages.map((msg, index) => <ChatMessage key={index} message={msg} />)}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>     
        <Box
        sx={{
          width: 500,
          maxWidth: '100%',
        }}
      >
        <TextField fullWidth type="text" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
      </Box>
        <Button type="submit" variant="contained" disabled={!formValue} endIcon={<SendIcon />}></Button>
      </form>
    </>
  );
};

// Componente para renderizar cada mensagem.
export const ChatMessage = (props) => {
  const { text, uid, photoURL, createdAt, displayName } = props.message; // Adicionamos createdAt aqui.

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
  // Convertendo o Timestamp do Firebase em um objeto Date do JavaScript.
  const messageDate = createdAt?.toDate();

  return (
    <div className={`message ${messageClass}`}>      
      <Card elevation={3} sx={{width: 'fit-content', borderRadius: '20px'}}>
        <CardActionArea sx={{display: 'flex', padding: '10px'}}>
        <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
        <div className="container-message-text">
          <Typography variant="caption" display="block" gutterBottom>{displayName} diz:</Typography >
          <Typography variant="body1" gutterBottom>{text}</Typography >
          <Typography variant="caption" display="block" gutterBottom>{messageDate?.toLocaleString()}</Typography >
        </div>
        </CardActionArea>      
      </Card>      
    </div>
  );
};


// Componente para o botão de login com o Google.
export const SignIn = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  // Ao clicar no botão, a função signInWithGoogle é chamada.
  return <Button variant="contained" sx={{width: {sx: '50%'}, margin: '0 auto'}} endIcon={<GoogleIcon/>} onClick={() => signInWithGoogle()}>Entrar com Google</Button>;
};

// Componente para o botão de logout.
export const SignOut = () => {
  return (
    // O botão de logout só aparece se o usuário estiver autenticado. Quando clicado, a função signOut é chamada.
    auth.currentUser && <Button color="error" variant="contained" onClick={() => auth.signOut()}><LogoutIcon/></Button>
  );
};
