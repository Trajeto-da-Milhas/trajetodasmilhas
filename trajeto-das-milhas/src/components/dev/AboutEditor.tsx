import React from 'react';
import { useContent } from '../../context/ContentContext';
import InputField from './InputField';
import TextAreaField from './TextAreaField';
import EditorSection from './EditorSection';
import ImageUpload from './ImageUpload';
import { User, Image } from 'lucide-react';

const AboutEditor: React.FC = () => {
  const { content, updateContent } = useContent();
  const { about } = content;

  const handleChange = (field: string, value: string) => {
    updateContent({
      ...content,
      about: { ...about, [field]: value }
    });
  };

  return (
    <EditorSection 
      title="Quem é" 
      description="Reforce a autoridade do Anderson Nascimento contando sua trajetória."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputField 
          label="Título da Seção" 
          value={about.title} 
          onChange={(val) => handleChange('title', val)}
          placeholder="Ex: Quem é Anderson Nascimento?"
          icon={<User size={14} />}
        />
        <InputField 
          label="Subtítulo / Cargo" 
          value={about.subtitle} 
          onChange={(val) => handleChange('subtitle', val)}
          placeholder="Ex: Especialista em Milhas"
        />
      </div>

      <TextAreaField 
        label="Descrição da Trajetória" 
        value={about.description} 
        onChange={(val) => handleChange('description', val)}
        placeholder="Conte a história e autoridade do especialista"
        rows={8}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
        <InputField 
          label="URL da Foto de Perfil" 
          value={about.imageUrl} 
          onChange={(val) => handleChange('imageUrl', val)}
          placeholder="https://images.unsplash.com/..."
          icon={<Image size={14} />}
          preview={
            <img 
              src={about.imageUrl} 
              className="w-full h-full object-cover" 
              alt="Anderson Nascimento"
              referrerPolicy="no-referrer"
            />
          }
        />
        <div className="pb-1">
          <ImageUpload 
            label="Fazer Upload da Foto" 
            onUploadSuccess={(url) => handleChange('imageUrl', url)} 
          />
        </div>
      </div>
    </EditorSection>
  );
};

export default AboutEditor;
