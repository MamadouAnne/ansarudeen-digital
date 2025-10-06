export interface ProjectComponent {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
}

export interface ProjectObjective {
  id: string;
  title: string;
  description: string;
}

export interface ProjectBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  galleryImages: string[];
  location: string;
  area: string;
  distance: string;
  mainObjective: string;
  objectives: ProjectObjective[];
  components: ProjectComponent[];
  benefits: ProjectBenefit[];
  context: string;
  vision: string;
  author: {
    name: string;
    title: string;
    contact: string;
  };
}
