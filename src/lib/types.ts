
export type VpsInstance = {
  id: number;
  name: string;
  ip: string;
  status: "running" | "stopped" | "starting";
  region: string;
};

// Placeholder data - this would eventually be fetched from your API
export const mockVpsInstances: VpsInstance[] = [
  { id: 1, name: "reseller-client-01", ip: "192.168.1.10", status: "running", region: "EU-Germany" },
  { id: 2, name: "reseller-client-02", ip: "192.168.1.11", status: "stopped", region: "US-East" },
  { id: 3, name: "internal-dev-server", ip: "192.168.1.12", status: "running", region: "US-West" },
  { id: 4, name: "staging-environment", ip: "192.168.1.13", status: "starting", region: "EU-Germany" },
];
