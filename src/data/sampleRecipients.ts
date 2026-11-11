import { Recipient } from '../types';

export const INITIAL_RECIPIENTS: Recipient[] = [
  {
    id: 'rec-mom',
    name: 'Almaz Kebede (Mom)',
    relationship: 'Mother',
    phone: '+251 91 123 4567',
    city: 'Addis Ababa',
    subcity: 'Bole',
    specificAddress: 'Bole Michael, behind Medhanialem Church, House 24B',
    meterNumber: '01429810523',
    waterContractNumber: 'AAWSA-9812-BL',
    notes: 'Please call before delivery; prefers morning deliveries',
  },
  {
    id: 'rec-dawit',
    name: 'Dawit Haile (Brother)',
    relationship: 'Brother',
    phone: '+251 92 456 7890',
    city: 'Hawassa',
    subcity: 'Menahariya',
    specificAddress: 'Near Hawassa University Main Campus Gate 2',
    notes: 'Student, can receive goods after 2 PM',
  },
  {
    id: 'rec-ayeletch',
    name: 'Ayelech Tadesse (Grandmother)',
    relationship: 'Grandmother',
    phone: '+251 91 888 2345',
    city: 'Addis Ababa',
    subcity: 'Arada',
    specificAddress: 'Piazza, near St. George Cathedral, Compound #12',
    meterNumber: '02819401776',
    notes: 'Elderly, courier should knock and assist with carrying heavy bags',
  },
];
