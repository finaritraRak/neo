import { InvoiceTemplate } from '../../types';
import { Check } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: InvoiceTemplate;
  onChange: (template: InvoiceTemplate) => void;
}

const templates: {
  id: InvoiceTemplate;
  name: string;
  description: string;
}[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Clean black and white design',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with blue accents',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional business style',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Colorful design for creative businesses',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-simple clean design',
  },
];

const TemplateSelector = ({ selectedTemplate, onChange }: TemplateSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Select Template</h3>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`
              relative rounded-lg border-2 p-4 cursor-pointer transition-all
              ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => onChange(template.id)}
          >
            {selectedTemplate === template.id && (
              <div className="absolute right-2 top-2 rounded-full bg-blue-500 p-1 text-white">
                <Check className="h-3 w-3" />
              </div>
            )}
            
            <div className="mb-2 h-20 bg-gray-100 rounded flex items-center justify-center">
              {/* This would be a template preview image in a real app */}
              <span className="text-sm text-gray-500">{template.name} Template</span>
            </div>
            
            <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
            <p className="mt-1 text-xs text-gray-500">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;