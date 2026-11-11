import React, { useState } from 'react';
import { Recipient } from '../types';
import { 
  X, 
  UserPlus, 
  MapPin, 
  Phone, 
  Trash2, 
  Check, 
  Zap, 
  Users 
} from 'lucide-react';

interface RecipientModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: Recipient[];
  activeRecipient: Recipient;
  onSelectRecipient: (recipient: Recipient) => void;
  onAddRecipient: (recipient: Recipient) => void;
  onDeleteRecipient: (id: string) => void;
}

const ETHIOPIAN_CITIES = [
  'Addis Ababa',
  'Hawassa',
  'Bahir Dar',
  'Adama (Nazret)',
  'Dire Dawa',
  'Bishoftu (Debre Zeit)',
  'Gondar',
  'Mekelle',
  'Jimma',
];

const ADDIS_SUBCITIES = [
  'Bole',
  'Kirkos',
  'Yeka',
  'Arada',
  'Nifas Silk-Lafto',
  'Kolfe Keranio',
  'Lideta',
  'Gulele',
  'Akaki Kality',
  'Lemi Kura',
];

export const RecipientModal: React.FC<RecipientModalProps> = ({
  isOpen,
  onClose,
  recipients,
  activeRecipient,
  onSelectRecipient,
  onAddRecipient,
  onDeleteRecipient,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Mother');
  const [phone, setPhone] = useState('+251 9');
  const [city, setCity] = useState('Addis Ababa');
  const [subcity, setSubcity] = useState('Bole');
  const [specificAddress, setSpecificAddress] = useState('');
  const [meterNumber, setMeterNumber] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newRec: Recipient = {
      id: `rec-${Date.now()}`,
      name: `${name} (${relationship})`,
      relationship,
      phone,
      city,
      subcity: city === 'Addis Ababa' ? subcity : undefined,
      specificAddress,
      meterNumber: meterNumber ? meterNumber : undefined,
    };

    onAddRecipient(newRec);
    setIsAdding(false);
    setName('');
    setPhone('+251 9');
    setSpecificAddress('');
    setMeterNumber('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                Family & Recipients in Ethiopia
              </h3>
              <p className="text-[11px] text-stone-500">
                Manage saved loved ones, phone numbers & meter details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* List of Recipients */}
          {!isAdding && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Saved Family Members ({recipients.length})
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdding(true)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add New</span>
                </button>
              </div>

              <div className="space-y-2">
                {recipients.map((rec) => {
                  const isSelected = rec.id === activeRecipient.id;

                  return (
                    <div
                      key={rec.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs'
                          : 'border-stone-200 bg-stone-50/60 hover:bg-stone-50'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                            {rec.name}
                          </h4>
                          {isSelected && (
                            <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          )}
                        </div>

                        <div className="mt-1 text-xs text-stone-600 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-stone-400" />
                            <span className="font-mono">{rec.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>{rec.city}{rec.subcity ? `, ${rec.subcity}` : ''} {rec.specificAddress ? `• ${rec.specificAddress}` : ''}</span>
                          </div>
                          {rec.meterNumber && (
                            <div className="flex items-center gap-1.5 text-emerald-800">
                              <Zap className="w-3 h-3 text-amber-500" />
                              <span>EEU Meter: <strong className="font-mono">{rec.meterNumber}</strong></span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {!isSelected && (
                          <button
                            type="button"
                            onClick={() => onSelectRecipient(rec)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-stone-300 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 transition-colors"
                          >
                            Select
                          </button>
                        )}
                        {recipients.length > 1 && (
                          <button
                            type="button"
                            onClick={() => onDeleteRecipient(rec.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add Recipient Form */}
          {isAdding && (
            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="font-bold text-stone-900 text-sm">
                  Add Family Member in Ethiopia
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-stone-400 hover:text-stone-600 text-xs"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Almaz Kebede"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    Relationship
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="Mother">Mother (እናት)</option>
                    <option value="Father">Father (አባት)</option>
                    <option value="Brother">Brother (ወንድም)</option>
                    <option value="Sister">Sister (እህት)</option>
                    <option value="Grandmother">Grandmother (አያት)</option>
                    <option value="Grandfather">Grandfather (አያት)</option>
                    <option value="Aunt">Aunt (አክስት)</option>
                    <option value="Uncle">Uncle (አጎት)</option>
                    <option value="Friend">Friend / Relative (ወዳጅ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Ethiopian Phone Number (+251...)
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251 91 123 4567"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                  >
                    {ETHIOPIAN_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {city === 'Addis Ababa' && (
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">
                      Sub-city (ክፍለ ከተማ)
                    </label>
                    <select
                      value={subcity}
                      onChange={(e) => setSubcity(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                    >
                      {ADDIS_SUBCITIES.map((sc) => (
                        <option key={sc} value={sc}>{sc}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Specific Address / Landmark (for couriers)
                </label>
                <input
                  type="text"
                  value={specificAddress}
                  onChange={(e) => setSpecificAddress(e.target.value)}
                  placeholder="e.g. Bole Michael, near Medhanialem Church, House #42"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Prepaid EEU Electricity Meter Number (Optional)
                </label>
                <input
                  type="text"
                  value={meterNumber}
                  onChange={(e) => setMeterNumber(e.target.value)}
                  placeholder="e.g. 01429810523 (for instant power token generation)"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-lg text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  Save Recipient
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
