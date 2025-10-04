import { supabase } from '@/lib/supabase';

export interface MediaItem {
  type: 'image' | 'video';
  uri: string;
}

export interface Project {
  id: number;
  title: string;
  titleArabic: string;
  description: string;
  fullDescription: string;
  category: string;
  icon: string;
  media: MediaItem[];
  status: 'ongoing' | 'planning' | 'completed';
  progress: number;
  budget: string;
  targetAmount: number;
  raisedAmount: number;
  startDate: string;
  donors: number;
}

interface ProjectRow {
  id: number;
  title: string;
  title_arabic: string;
  description: string;
  full_description: string;
  category: string;
  icon: string;
  status: 'ongoing' | 'planning' | 'completed';
  progress: number;
  budget: string;
  target_amount: number;
  raised_amount: number;
  start_date: string;
  donors: number;
}

interface ProjectMediaRow {
  type: 'image' | 'video';
  uri: string;
  display_order: number;
}

/**
 * Fetch all projects with their media
 */
export async function getAllProjects(): Promise<Project[]> {
  try {
    // Fetch projects
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('id', { ascending: true });

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      throw projectsError;
    }

    if (!projectsData || projectsData.length === 0) {
      return [];
    }

    // Fetch all project media
    const { data: mediaData, error: mediaError } = await supabase
      .from('project_media')
      .select('project_id, type, uri, display_order')
      .order('display_order', { ascending: true });

    if (mediaError) {
      console.error('Error fetching project media:', mediaError);
      throw mediaError;
    }

    // Map projects with their media
    const projects: Project[] = projectsData.map((project: ProjectRow) => {
      const projectMedia = mediaData
        ?.filter((media: any) => media.project_id === project.id)
        .map((media: ProjectMediaRow) => ({
          type: media.type,
          uri: media.uri,
        })) || [];

      return {
        id: project.id,
        title: project.title,
        titleArabic: project.title_arabic,
        description: project.description,
        fullDescription: project.full_description,
        category: project.category,
        icon: project.icon,
        status: project.status,
        progress: project.progress,
        budget: project.budget,
        targetAmount: project.target_amount,
        raisedAmount: project.raised_amount,
        startDate: project.start_date,
        donors: project.donors,
        media: projectMedia,
      };
    });

    return projects;
  } catch (error) {
    console.error('Error in getAllProjects:', error);
    return [];
  }
}

/**
 * Fetch a single project by ID with its media
 */
export async function getProjectById(projectId: number): Promise<Project | null> {
  try {
    // Fetch project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError) {
      console.error('Error fetching project:', projectError);
      throw projectError;
    }

    if (!projectData) {
      return null;
    }

    // Fetch project media
    const { data: mediaData, error: mediaError } = await supabase
      .from('project_media')
      .select('type, uri, display_order')
      .eq('project_id', projectId)
      .order('display_order', { ascending: true });

    if (mediaError) {
      console.error('Error fetching project media:', mediaError);
      throw mediaError;
    }

    console.log('Project media data:', mediaData);

    const project: Project = {
      id: projectData.id,
      title: projectData.title,
      titleArabic: projectData.title_arabic,
      description: projectData.description,
      fullDescription: projectData.full_description,
      category: projectData.category,
      icon: projectData.icon,
      status: projectData.status,
      progress: projectData.progress,
      budget: projectData.budget,
      targetAmount: projectData.target_amount,
      raisedAmount: projectData.raised_amount,
      startDate: projectData.start_date,
      donors: projectData.donors,
      media: mediaData?.map((media: ProjectMediaRow) => ({
        type: media.type,
        uri: media.uri,
      })) || [],
    };

    console.log('Final project object:', JSON.stringify(project, null, 2));

    return project;
  } catch (error) {
    console.error('Error in getProjectById:', error);
    return null;
  }
}

/**
 * Fetch projects by status
 */
export async function getProjectsByStatus(status: 'ongoing' | 'planning' | 'completed'): Promise<Project[]> {
  try {
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('status', status)
      .order('id', { ascending: true });

    if (projectsError) {
      console.error('Error fetching projects by status:', projectsError);
      throw projectsError;
    }

    if (!projectsData || projectsData.length === 0) {
      return [];
    }

    // Fetch media for these projects
    const projectIds = projectsData.map((p: ProjectRow) => p.id);
    const { data: mediaData, error: mediaError } = await supabase
      .from('project_media')
      .select('project_id, type, uri, display_order')
      .in('project_id', projectIds)
      .order('display_order', { ascending: true });

    if (mediaError) {
      console.error('Error fetching project media:', mediaError);
      throw mediaError;
    }

    const projects: Project[] = projectsData.map((project: ProjectRow) => {
      const projectMedia = mediaData
        ?.filter((media: any) => media.project_id === project.id)
        .map((media: ProjectMediaRow) => ({
          type: media.type,
          uri: media.uri,
        })) || [];

      return {
        id: project.id,
        title: project.title,
        titleArabic: project.title_arabic,
        description: project.description,
        fullDescription: project.full_description,
        category: project.category,
        icon: project.icon,
        status: project.status,
        progress: project.progress,
        budget: project.budget,
        targetAmount: project.target_amount,
        raisedAmount: project.raised_amount,
        startDate: project.start_date,
        donors: project.donors,
        media: projectMedia,
      };
    });

    return projects;
  } catch (error) {
    console.error('Error in getProjectsByStatus:', error);
    return [];
  }
}

/**
 * Fetch projects by category
 */
export async function getProjectsByCategory(category: string): Promise<Project[]> {
  try {
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('category', category)
      .order('id', { ascending: true });

    if (projectsError) {
      console.error('Error fetching projects by category:', projectsError);
      throw projectsError;
    }

    if (!projectsData || projectsData.length === 0) {
      return [];
    }

    // Fetch media for these projects
    const projectIds = projectsData.map((p: ProjectRow) => p.id);
    const { data: mediaData, error: mediaError } = await supabase
      .from('project_media')
      .select('project_id, type, uri, display_order')
      .in('project_id', projectIds)
      .order('display_order', { ascending: true });

    if (mediaError) {
      console.error('Error fetching project media:', mediaError);
      throw mediaError;
    }

    const projects: Project[] = projectsData.map((project: ProjectRow) => {
      const projectMedia = mediaData
        ?.filter((media: any) => media.project_id === project.id)
        .map((media: ProjectMediaRow) => ({
          type: media.type,
          uri: media.uri,
        })) || [];

      return {
        id: project.id,
        title: project.title,
        titleArabic: project.title_arabic,
        description: project.description,
        fullDescription: project.full_description,
        category: project.category,
        icon: project.icon,
        status: project.status,
        progress: project.progress,
        budget: project.budget,
        targetAmount: project.target_amount,
        raisedAmount: project.raised_amount,
        startDate: project.start_date,
        donors: project.donors,
        media: projectMedia,
      };
    });

    return projects;
  } catch (error) {
    console.error('Error in getProjectsByCategory:', error);
    return [];
  }
}
