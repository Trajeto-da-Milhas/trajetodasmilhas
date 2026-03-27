import React from 'react';
import { useContent } from '../../context/ContentContext';
import InputField from './InputField';
import TextAreaField from './TextAreaField';
import EditorSection from './EditorSection';
import ImageUpload from './ImageUpload';
import { Image } from 'lucide-react';

const WhatIsEditor: React.FC = () => {
  const { content, updateContent } = useContent();
  const { whatis } = content;

  const handleChange = (field: string, value: string) => {
    updateContent({
      ...content,
      whatis: { ...whatis, [field]: value }
    });
  };

  return (
    <EditorSection 
      title="O que é" 
      description="Explique o conceito do Trajeto das Milhas e como ele ajuda o cliente."
    >
      <InputField 
        label="Título da Seção" 
        value={whatis.title} 
        onChange={(val) => handleChange('title', val)}
        placeholder="Ex: O que é o Trajeto das Milhas?"
      />

      <TextAreaField 
        label="Descrição" 
        value={whatis.description} 
        onChange={(val) => handleChange('description', val)}
        placeholder="Descreva o serviço detalhadamente"
        rows={6}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
        <InputField 
          label="URL da Imagem de Destaque" 
          value={whatis.imageUrl} 
          onChange={(val) => handleChange('imageUrl', val)}
          placeholder="https://images.unsplash.com/..."
          icon={<Image size={14} />}
          preview={
            <img 
              src={whatis.imageUrl} 
              className="w-full h-full object-cover" 
              alt="Preview"
              referrerPolicy="no-referrer"
            />
          }
        />
        <div className="pb-1">
          <ImageUpload 
            label="Fazer Upload da Imagem" 
            onUploadSuccess={(url) => handleChange('imageUrl', url)} 
          />
        </div>
      </div>
    </EditorSection>
  );
};

export default WhatIsEditor;
