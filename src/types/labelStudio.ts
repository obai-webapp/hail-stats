export interface LabelStudioAnnotation {
  id: number;
  created_at: string;
  updated_at: string;
  completed_by?: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  result: AnnotationResult[];
}

export interface AnnotationResult {
  id: string;
  type: string;
  from_name: string;
  to_name: string;
  value: {
    choices?: string[];
    rectanglelabels?: string[];
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
}

export interface LabelStudioTask {
  id: number;
  data: {
    image?: string;
    [key: string]: unknown;
  };
  annotations: LabelStudioAnnotation[];
  predictions?: unknown[];
}

export type HailPresent = 'YES' | 'NO' | 'PENDING';
export type DentSize = 'DIME' | 'NICKEL' | 'QUARTER' | 'HALF_DOLLAR' | 'OVERSIZED';

export interface ProcessedTask {
  task_id: number;
  image: string;
  hail_present: HailPresent;
  has_damage: boolean;
  primary_panel: string;
  method: string;
  hail_grid_present_in_photo: string;
  hail_grid_type: string;
  dent_boxes_count_total: number;
  dent_boxes_count_by_size: Record<DentSize, number>;
  final_total_dents: number;
  final_dime_count: number;
  final_nickel_count: number;
  final_quarter_count: number;
  final_half_dollar_count: number;
  final_oversized_count: number;
  updated_at: string;
  annotator: string;
}

export interface DatasetStats {
  totalTasks: number;
  damageCount: number;
  noDamageCount: number;
  pendingCount: number;
  dentSizeDistribution: {
    size: DentSize;
    totalBoxes: number;
    imageCount: number;
  }[];
  primaryPanelDistribution: Record<string, number>;
  methodDistribution: Record<string, number>;
  hailGridTypeDistribution: Record<string, number>;
  processedTasks: ProcessedTask[];
}
