

export interface Technology {
  id: number; 
  name: string;
  usage: 'frontend' | 'backend';
  difficulty: 'easy' | 'medium' | 'hard';
  popularity: 'low' | 'medium' | 'high';
  firstRelease: number;
  typescript: boolean;
  description: string;
}