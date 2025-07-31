import axios from 'axios';

// Interface for the freshweek API response
export interface FreshWeekResponse {
  ws_emp_id: number;
  ws_emp_code: string;
  ws_start_date: string;
  ws_end_date: string;
  ws_success: string;
  ws_challenges: string;
  ws_unfinished_tasks: string;
  ws_next_actions: string;
  ws_work_days: number;
  ws_WFH: number;
  ws_WFO: number;
  ws_efforts: number;
  ws_leaves: number;
  ws_Holidays: number;
  ws_extra_days: number;
  ws_submitted_on: string;
  ws_status: string;
  ws_week_number: number;
  ws_co_id: number;
  ws_week_id: number;
  ws_available_hours: number;
  ws_created_on: string;
  ws_active_status: string;
}

// Interface for the table row data
export interface WeekDetailsRow {
  weekStart: string;
  weekEnd: string;
  WD: string;
  H: string;
  L: string;
  WFH: string;
  WFO: string;
  ED: string;
  Efforts: string;
  Status: string;
}

// API service class
class ApiService {
  private baseURL = 'http://localhost:8081/pms/api';
  private axiosInstance = axios.create({
    timeout: 10000, // 10 second timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Fetch freshweek data
  async getFreshWeek(empId: number, weekId: number): Promise<FreshWeekResponse> {
    try {
      console.log(`Fetching freshweek data for empId: ${empId}, weekId: ${weekId}`);
      const response = await this.axiosInstance.get<FreshWeekResponse>(
        `${this.baseURL}/e/freshweek/${empId}/${weekId}`
      );
      console.log('API Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching freshweek data:', error);
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      if (error.response) {
        // Server responded with error status
        throw new Error(`Server error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        // Network error
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        // Other error
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  }

  // Transform API response to table row format
  transformToTableRow(data: FreshWeekResponse): WeekDetailsRow {
    return {
      weekStart: data.ws_start_date,
      weekEnd: data.ws_end_date,
      WD: data.ws_work_days.toString(),
      H: data.ws_Holidays.toString(),
      L: data.ws_leaves.toString(),
      WFH: data.ws_WFH.toString(),
      WFO: data.ws_WFO.toString(),
      ED: data.ws_extra_days.toString(),
      Efforts: `${data.ws_efforts} days ${data.ws_available_hours} hrs`,
      Status: data.ws_status === 'U' ? 'In-Progress' : 'Completed'
    };
  }
}

export const apiService = new ApiService();
export default apiService;