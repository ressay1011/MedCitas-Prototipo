import { useState } from 'react';
import { Stethoscope, Heart, Smile, Eye, Droplet, Search } from 'lucide-react';
import Card from '../common/Card';
import Input from '../common/Input';
import { MOCK_SPECIALTIES } from '../../data/mockSpecialties';

const iconMap = {
  Stethoscope,
  Heart,
  Smile,
  Eye,
  Droplet
};

const SpecialtySelector = ({ selectedSpecialty, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSpecialties = MOCK_SPECIALTIES.filter(spec =>
    spec.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spec.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-4">
      <div className="space-y-3">
        {filteredSpecialties.map((specialty) => {
          const Icon = iconMap[specialty.icono] || Stethoscope;
          const isSelected = selectedSpecialty?.id === specialty.id;

          return (
            <Card
              key={specialty.id}
              onClick={() => onSelect(specialty)}
              variant="light"
              className={`
                cursor-pointer
                transition-all duration-200
                ${isSelected
                  ? 'border-2 border-primary'
                  : 'border border-border'}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-textPrimary">
                    {specialty.nombre}
                  </h3>
                </div>
                <div className={`
                  flex-shrink-0
                  w-6 h-6
                  rounded-full
                  border-2
                  flex items-center justify-center
                  ml-4
                  ${isSelected 
                    ? 'border-primary bg-primary' 
                    : 'border-textSecondary bg-white'}
                  transition-colors duration-200
                `}>
                  {isSelected && (
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SpecialtySelector;

