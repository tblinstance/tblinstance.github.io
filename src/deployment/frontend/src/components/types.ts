export interface Plan {
  id: string;
  name: string;
  cpu: number;
  ram: string;
  storage: string;
  bandwidth: string;
  price_bdt: number;
  base_price?: number;
  markup?: number;
  snapshots?: number;
  port_speed?: string;
  traffic?: string;
}

export interface ModalConfig {
  isOpen: boolean;
  type: 'alert' | 'confirm';
  isDanger?: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
}

export interface PromptConfig {
  isOpen: boolean;
  title: string;
  onConfirm: (val: string) => void;
}

export const REGIONS = [
  { id: 'EU', name: 'European Union (Germany)' },
  { id: 'US-central', name: 'United States (Central)' },
  { id: 'SIN', name: 'Asia (Singapore)' },
  { id: 'UK', name: 'United Kingdom' },
];

export const IMAGES = [
  { id: 'afecbb85-e2fc-46f0-9684-b46b1faf00bb', name: 'Ubuntu 22.04 LTS' },
  { id: 'd64d5c6c-9dda-4e38-8174-0ee282474d8a', name: 'Ubuntu 24.04 LTS' },
  { id: 'f5193fe6-d547-4726-9271-cdb2819833fd', name: 'Ubuntu 26.04 LTS (Latest)' },
  { id: '0a3f4b06-a104-4917-bc85-11eba40cb6de', name: 'Debian 13' },
  { id: '5ba225f5-2a96-4d84-9a16-88909e45c18d', name: 'Debian 12 + Plesk' },
  { id: '2c37807f-1ea3-40b4-9fb2-b448c009d9a5', name: 'Rocky Linux 10' },
  { id: '68bab40e-df12-4027-b450-de619ff2e83d', name: 'AlmaLinux 10' },
  { id: '5af826e8-0e9d-4cec-9728-0966f98b4565', name: 'Windows Server 2025 SE' },
];
