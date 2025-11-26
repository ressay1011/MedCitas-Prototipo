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
      <Input
        type="text"
        placeholder="Buscar especialidad..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={Search}
      />

      <div className="space-y-3">
        {filteredSpecialties.map((specialty) => {
          const Icon = iconMap[specialty.icono] || Stethoscope;
          const isSelected = selectedSpecialty?.id === specialty.id;

          return (
            <Card
              key={specialty.id}
              onClick={() => onSelect(specialty)}
              className={`
                cursor-pointer
                transition-all duration-200
                ${isSelected 
                  ? 'border-2 border-primary bg-primaryLight' 
                  : 'border border-border hover:border-primary'}
              `}
            >
              <div className="flex items-center space-x-4">
                <div className={`
                  flex-shrink-0
                  w-12 h-12
                  rounded-full
                  flex items-center justify-center
                  ${isSelected ? 'bg-primary text-white' : 'bg-backgroundGray text-textPrimary'}
                  transition-colors duration-200
                `}>
                  <Icon size={24} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className={`
                      text-lg font-medium
                      ${isSelected ? 'text-primary' : 'text-textPrimary'}
                    `}>
                      {specialty.nombre}
                    </h3>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-textSecondary mt-0.5">
                    {specialty.descripcion}
                  </p>
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

