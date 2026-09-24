export interface StationMetric {
  label: string;
  value: string;
}

export interface Station {
  id: string;
  frequency: number; // in MHz, e.g. 88.5
  callsign: string;
  title: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  category: 'experience' | 'project' | 'research' | 'origin';
  description: string;
  bulletPoints?: string[];
  tech: string[];
  metrics: StationMetric[];
  accentColor: string; // Neon hex code
  position3D: [number, number, number];
  towerScale?: number;
  caseStudyUrl?: string;
  repoUrl?: string;
}
