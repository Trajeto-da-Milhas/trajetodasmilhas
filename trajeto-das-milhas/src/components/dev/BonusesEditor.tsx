import React from 'react';
import { useContent } from '../../context/ContentContext';
import InputField from './InputField';
import TextAreaField from './TextAreaField';
import EditorSection from './EditorSection';
import ListItemEditor from './ListItemEditor';
import ImageUpload from './ImageUpload';
import { Image } from 'lucide-react';

const BonusesEditor: React.FC = () => {
  const { content, updateContent } = useContent();
  const { bonuses } = content;

  const handleUpdate = (newBonuses: typeof bonuses) => {
    updateContent({
      ...content,
      bonuses: newBonuses
    });
  };

  const handleItemChange = (id: string, field: string, value: string) => {
    const newBonuses = bonuses.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    handleUpdate(newBonuses);
  };

  const newItemTemplate = () => ({
    id: Date.now().toString(),
    title: 'Novo Bônus',
    description: 'Descrição do novo bônus exclusivo.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400'
  });

  return (
    <EditorSection 
      title="Bônus" 
      description="Aumente o valor percebido do seu produto com bônus exclusivos."
    >
      <ListItemEditor
        title="LISTA DE BÔNUS"
        items={bonuses}
        onUpdate={handleUpdate}
        newItemTemplate={newItemTemplate}
        renderItem={(item) => (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Título do Bônus" 
                value={item.title} 
                onChange={(val) => handleItemChange(item.id, 'title', val)}
                placeholder="Ex: Aula de Acúmulo Estratégico"
              />
              <div className="space-y-4">
                <InputField 
                  label="URL da Imagem" 
                  value={item.imageUrl} 
                  onChange={(val) => handleItemChange(item.id, 'imageUrl', val)}
                  placeholder="https://images.unsplash.com/..."
                  icon={<Image size={14} />}
                  preview={
                    <img 
                      src={item.imageUrl} 
                      className="w-full h-full object-cover" 
                      alt="Bônus"
                      referrerPolicy="no-referrer"
                    />
                  }
                />
                <ImageUpload 
                  label="Fazer Upload da Imagem" 
                  onUploadSuccess={(url) => handleItemChange(item.id, 'imageUrl', url)} 
                />
              </div>
            </div>
            <TextAreaField 
              label="Descrição do Bônus" 
              value={item.description} 
              onChange={(val) => handleItemChange(item.id, 'description', val)}
              placeholder="Explique o que o cliente ganha"
              rows={4}
            />
          </div>
        )}
      />
    </EditorSection>
  );
};

export default BonusesEditor;
