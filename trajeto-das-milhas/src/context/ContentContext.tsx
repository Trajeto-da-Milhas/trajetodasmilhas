import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDocFromServer } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { SiteContent } from '../types';
import { defaultContent } from '../data/defaultContent';
import { db, auth } from '../firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface ContentContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => Promise<void>;
  user: User | null;
  isAuthReady: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Test connection to Firestore
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  // Listen for Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Listen for Content changes from Firestore
  useEffect(() => {
    console.log("Iniciando monitoramento do Firestore...");
    const contentDoc = doc(db, 'content', 'main');
    const unsubscribe = onSnapshot(contentDoc, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as SiteContent;
        console.log("Dados recebidos do Firestore:", data);
        setContent(data);
      } else {
        console.log("Nenhum dado encontrado no Firestore, usando padrão.");
        // Se estiver no modo dev e não houver dados, vamos salvar o padrão no Firestore
        if (window.location.pathname.includes('/dev')) {
           setDoc(contentDoc, defaultContent).catch(err => console.error("Erro ao inicializar Firestore:", err));
        }
      }
    }, (error) => {
      console.error("Erro no onSnapshot:", error);
      // Não travar o site se houver erro de permissão, apenas logar
      // handleFirestoreError(error, OperationType.GET, 'content/main');
    });

    return () => unsubscribe();
  }, []);

  const updateContent = async (newContent: SiteContent) => {
    console.log("Tentando salvar conteúdo no Firestore...", newContent);
    try {
      const contentDoc = doc(db, 'content', 'main');
      await setDoc(contentDoc, {
        ...newContent,
        updatedAt: new Date().toISOString()
      });
      console.log("Conteúdo salvo com sucesso no Firestore!");
    } catch (error) {
      console.error("Erro detalhado ao salvar no Firestore:", error);
      if (error instanceof Error) {
        console.error("Mensagem de erro:", error.message);
        console.error("Stack trace:", error.stack);
        // Exibir alerta detalhado no navegador para o usuário
        alert(`Erro ao salvar no Firebase: ${error.message}\n\nVerifique o console para mais detalhes.`);
      }
      handleFirestoreError(error, OperationType.WRITE, 'content/main');
    }
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, user, isAuthReady }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
