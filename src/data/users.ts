import type { User, Address } from '@/types/user'

export const sampleUser: User = {
  id: 'user-1',
  email: 'john.perera@email.com',
  firstName: 'John',
  lastName: 'Perera',
  phone: '+94 77 123 4567',
  avatar: 'https://picsum.photos/seed/avatar1/150/150',
  dateOfBirth: '1990-05-15',
  gender: 'male',
  isVerified: true,
  createdAt: '2023-06-15T10:00:00Z',
  updatedAt: '2024-01-10T15:30:00Z',
}

export const sampleAddresses: Address[] = [
  {
    id: 'addr-1',
    userId: 'user-1',
    label: 'Home',
    firstName: 'John',
    lastName: 'Perera',
    phone: '+94 77 123 4567',
    addressLine1: '45 Galle Road',
    addressLine2: 'Apartment 3B',
    city: 'Colombo',
    district: 'Colombo',
    postalCode: '00300',
    country: 'Sri Lanka',
    isDefault: true,
    type: 'home',
  },
  {
    id: 'addr-2',
    userId: 'user-1',
    label: 'Office',
    firstName: 'John',
    lastName: 'Perera',
    phone: '+94 77 123 4567',
    addressLine1: '123 Union Place',
    addressLine2: 'Level 5, Tech Tower',
    city: 'Colombo',
    district: 'Colombo',
    postalCode: '00200',
    country: 'Sri Lanka',
    isDefault: false,
    type: 'office',
  },
]

export const sriLankanDistricts = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya',
]

export const sriLankanCities: Record<string, string[]> = {
  Colombo: ['Colombo 1', 'Colombo 2', 'Colombo 3', 'Colombo 4', 'Colombo 5', 'Colombo 6', 'Colombo 7', 'Mount Lavinia', 'Dehiwala', 'Moratuwa'],
  Gampaha: ['Negombo', 'Wattala', 'Ja-Ela', 'Kandana', 'Ragama', 'Kelaniya', 'Minuwangoda'],
  Kandy: ['Kandy', 'Peradeniya', 'Katugastota', 'Kundasale', 'Gampola'],
  Galle: ['Galle', 'Unawatuna', 'Hikkaduwa', 'Ambalangoda'],
  Matara: ['Matara', 'Weligama', 'Mirissa', 'Dickwella'],
}
