import type { 
  LabelStudioTask, 
  LabelStudioAnnotation, 
  ProcessedTask, 
  DatasetStats,
  HailPresent,
  DentSize,
  AnnotationResult
} from '@/types/labelStudio';

const DENT_SIZES: DentSize[] = ['DIME', 'NICKEL', 'QUARTER', 'HALF_DOLLAR', 'OVERSIZED'];

function getLatestAnnotation(annotations: LabelStudioAnnotation[]): LabelStudioAnnotation | null {
  if (!annotations || annotations.length === 0) return null;
  
  return annotations.reduce((latest, current) => {
    const latestDate = new Date(latest.updated_at || latest.created_at);
    const currentDate = new Date(current.updated_at || current.created_at);
    return currentDate > latestDate ? current : latest;
  });
}

function getResultByFromName(results: AnnotationResult[], fromName: string): AnnotationResult | undefined {
  return results.find(r => r.from_name === fromName);
}

function getAllResultsByFromName(results: AnnotationResult[], fromName: string): AnnotationResult[] {
  return results.filter(r => r.from_name === fromName);
}

function extractChoice(result: AnnotationResult | undefined): string {
  if (!result || !result.value.choices || result.value.choices.length === 0) {
    return '';
  }
  return result.value.choices[0];
}

function countDentBoxesBySize(results: AnnotationResult[]): Record<DentSize, number> {
  const counts: Record<DentSize, number> = {
    DIME: 0,
    NICKEL: 0,
    QUARTER: 0,
    HALF_DOLLAR: 0,
    OVERSIZED: 0
  };
  
  const dentBoxes = getAllResultsByFromName(results, 'dent_boxes');
  
  for (const box of dentBoxes) {
    const labels = box.value.rectanglelabels || [];
    for (const label of labels) {
      const upperLabel = label.toUpperCase() as DentSize;
      if (DENT_SIZES.includes(upperLabel)) {
        counts[upperLabel]++;
      }
    }
  }
  
  return counts;
}

function processTask(task: LabelStudioTask): ProcessedTask {
  const annotation = getLatestAnnotation(task.annotations);
  const results = annotation?.result || [];
  
  const hailPresentResult = getResultByFromName(results, 'hail_present');
  const hailPresentValue = extractChoice(hailPresentResult);
  
  let hailPresent: HailPresent = 'PENDING';
  if (hailPresentValue === 'YES') hailPresent = 'YES';
  else if (hailPresentValue === 'NO') hailPresent = 'NO';
  
  const dentCounts = countDentBoxesBySize(results);
  const totalDents = Object.values(dentCounts).reduce((a, b) => a + b, 0);
  
  const annotator = annotation?.completed_by 
    ? `${annotation.completed_by.first_name || ''} ${annotation.completed_by.last_name || ''}`.trim() || annotation.completed_by.email
    : '';
  
  return {
    task_id: task.id,
    image: task.data.image || '',
    hail_present: hailPresent,
    has_damage: hailPresent === 'YES',
    primary_panel: extractChoice(getResultByFromName(results, 'primary_panel')),
    method: extractChoice(getResultByFromName(results, 'method')),
    hail_grid_present_in_photo: extractChoice(getResultByFromName(results, 'hail_grid_present_in_photo')),
    hail_grid_type: extractChoice(getResultByFromName(results, 'hail_grid_type')),
    dent_boxes_count_total: totalDents,
    dent_boxes_count_by_size: dentCounts,
    final_total_dents: totalDents,
    final_dime_count: dentCounts.DIME,
    final_nickel_count: dentCounts.NICKEL,
    final_quarter_count: dentCounts.QUARTER,
    final_half_dollar_count: dentCounts.HALF_DOLLAR,
    final_oversized_count: dentCounts.OVERSIZED,
    updated_at: annotation?.updated_at || annotation?.created_at || '',
    annotator
  };
}

export function parseDataset(tasks: LabelStudioTask[]): DatasetStats {
  const processedTasks = tasks.map(processTask);
  
  const damageCount = processedTasks.filter(t => t.hail_present === 'YES').length;
  const noDamageCount = processedTasks.filter(t => t.hail_present === 'NO').length;
  const pendingCount = processedTasks.filter(t => t.hail_present === 'PENDING').length;
  
  // Dent size distribution (only for damage images)
  const damageTasks = processedTasks.filter(t => t.has_damage);
  const dentSizeDistribution = DENT_SIZES.map(size => {
    const totalBoxes = damageTasks.reduce((sum, t) => sum + t.dent_boxes_count_by_size[size], 0);
    const imageCount = damageTasks.filter(t => t.dent_boxes_count_by_size[size] > 0).length;
    return { size, totalBoxes, imageCount };
  });
  
  // Primary panel distribution (only for damage images)
  const primaryPanelDistribution: Record<string, number> = {};
  for (const task of damageTasks) {
    if (task.primary_panel) {
      primaryPanelDistribution[task.primary_panel] = (primaryPanelDistribution[task.primary_panel] || 0) + 1;
    }
  }
  
  // Method distribution
  const methodDistribution: Record<string, number> = {};
  for (const task of damageTasks) {
    if (task.method) {
      methodDistribution[task.method] = (methodDistribution[task.method] || 0) + 1;
    }
  }
  
  // Hail grid type distribution
  const hailGridTypeDistribution: Record<string, number> = {};
  for (const task of damageTasks) {
    if (task.hail_grid_type) {
      hailGridTypeDistribution[task.hail_grid_type] = (hailGridTypeDistribution[task.hail_grid_type] || 0) + 1;
    }
  }
  
  return {
    totalTasks: tasks.length,
    damageCount,
    noDamageCount,
    pendingCount,
    dentSizeDistribution,
    primaryPanelDistribution,
    methodDistribution,
    hailGridTypeDistribution,
    processedTasks
  };
}

export function generateCSV(tasks: ProcessedTask[]): string {
  const headers = [
    'task_id',
    'image',
    'hail_present',
    'has_damage',
    'primary_panel',
    'method',
    'hail_grid_present_in_photo',
    'hail_grid_type',
    'dent_boxes_count_total',
    'dent_boxes_count_by_size',
    'final_total_dents',
    'final_dime_count',
    'final_nickel_count',
    'final_quarter_count',
    'final_half_dollar_count',
    'final_oversized_count',
    'updated_at',
    'annotator'
  ];
  
  const rows = tasks.map(task => [
    task.task_id,
    task.image,
    task.hail_present,
    task.has_damage,
    task.primary_panel,
    task.method,
    task.hail_grid_present_in_photo,
    task.hail_grid_type,
    task.dent_boxes_count_total,
    JSON.stringify(task.dent_boxes_count_by_size),
    task.final_total_dents,
    task.final_dime_count,
    task.final_nickel_count,
    task.final_quarter_count,
    task.final_half_dollar_count,
    task.final_oversized_count,
    task.updated_at,
    task.annotator
  ]);
  
  const escapeCsvValue = (value: unknown): string => {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  
  return [
    headers.join(','),
    ...rows.map(row => row.map(escapeCsvValue).join(','))
  ].join('\n');
}

export function generateSlackSummary(stats: DatasetStats): string {
  const lines: string[] = [
    '📊 *Hail Damage Dataset Statistics*',
    '',
    '*Summary:*',
    `• Total tasks: ${stats.totalTasks}`,
    `• ✅ Damage (hail_present=YES): ${stats.damageCount}`,
    `• ❌ No damage (hail_present=NO): ${stats.noDamageCount}`,
    `• ⏳ Pending/unlabeled: ${stats.pendingCount}`,
    '',
    '*Dent Size Distribution (damage images only):*'
  ];
  
  for (const { size, totalBoxes, imageCount } of stats.dentSizeDistribution) {
    lines.push(`• ${size}: ${totalBoxes} boxes across ${imageCount} images`);
  }
  
  if (Object.keys(stats.primaryPanelDistribution).length > 0) {
    lines.push('', '*Primary Panel Distribution:*');
    for (const [panel, count] of Object.entries(stats.primaryPanelDistribution).sort((a, b) => b[1] - a[1])) {
      lines.push(`• ${panel}: ${count}`);
    }
  }
  
  if (Object.keys(stats.methodDistribution).length > 0) {
    lines.push('', '*Method Distribution:*');
    for (const [method, count] of Object.entries(stats.methodDistribution).sort((a, b) => b[1] - a[1])) {
      lines.push(`• ${method}: ${count}`);
    }
  }
  
  if (Object.keys(stats.hailGridTypeDistribution).length > 0) {
    lines.push('', '*Hail Grid Type Distribution:*');
    for (const [type, count] of Object.entries(stats.hailGridTypeDistribution).sort((a, b) => b[1] - a[1])) {
      lines.push(`• ${type}: ${count}`);
    }
  }
  
  return lines.join('\n');
}
