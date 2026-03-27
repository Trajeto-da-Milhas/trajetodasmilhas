import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { SiteContent } from '../types';
import { defaultContent } from '../data/defaultContent';
import { db, auth } from '../firebase';

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
        // Inicializar o banco se estiver vazio
        setDoc(contentDoc, defaultContent).catch(err => console.error("Erro ao inicializar Firestore:", err));
      }
    }, (error) => {
      console.error("Erro crítico no Firestore (onSnapshot):", error);
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
      alert("✅ ALTERAÇÕES SALVAS COM SUCESSO NO SITE!");
    } catch (error) {
      console.error("Erro detalhado ao salvar no Firestore:", error);
      let errorMessage = "Erro desconhecido.";
      if (error instanceof Error) errorMessage = error.message;
      
      alert(`❌ ERRO AO SALVAR NO FIREBASE:\n${errorMessage}\n\nVerifique se o domínio trajetodasmilhas.github.io está autorizado no console do Firebase.`);
      throw error;
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
