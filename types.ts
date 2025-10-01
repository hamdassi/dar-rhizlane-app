
export interface KpiData {
  totalRevenue: string;
  occupancyRate: string;
  averageDailyRate: string;
  analysisPeriod: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface TimeSeriesDataPoint {
  date: string;
  rate: number;
}

export interface AdrDataPoint {
  category: string;
  adr: number;
}

export interface RoomsSoldDataPoint {
  category: string;
  roomsSold: number;
}

export interface DetailedTableEntry {
  category: string;
  roomsSold: number;
  adr: number;
  revenue: number;
}

export interface HotelData {
  kpis: KpiData;
  revenueDistribution: ChartDataPoint[];
  occupancyEvolution: TimeSeriesDataPoint[];
  adrByCategory: AdrDataPoint[];
  roomsSoldByCategory: RoomsSoldDataPoint[];
  detailedData: DetailedTableEntry[];
}

export interface ProcessedReport {
  fileName: string;
  data: HotelData;
}
