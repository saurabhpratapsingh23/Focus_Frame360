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
  Efforts: number;
  Status: string;
  week_id?: number;
  emp_id?: number;
  emp_code?: string;
  week_number?: number;
}

// Interface for the weeklisting API response
export interface WeekListingResponse {
  week_id?: number;
  week_number?: number;
  week_start_date?: string;
  week_end_date?: string;
  week_working_days?: number;
  week_holidays?: number;
  daily_working_hours?: number;
  week_emp_id?: number;
  week_emp_code?: string;
  week_WFH?: number;
  week_WFO?: number;
  week_efforts?: number;
  week_leaves?: number;
  week_extra_days?: number;
  week_submitted_on?: string;
  week_status?: string;
  ws_active_status?: string;
}

// Interface for the getwsrow API request
export interface GetWsRowRequest {
  goal_rec_id: number;
  emp_id: number;
  emp_code: string;
  week_number: number;
  co_id: number;
  week_id: number;
}

// Interface for the getwsrow API response
export interface GetWsRowResponse {
  // Add response fields based on actual API response
  success?: boolean;
  message?: string;
  data?: any;
}

// API service class
class ApiService {
  private baseURL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/pms/api`;
  private axiosInstance = axios.create({
    timeout: 10000, // 10 second timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    console.log('API Service initialized with base URL:', this.baseURL);
    console.log('Environment VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  }

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
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response,
        request: error.request,
        config: error.config
      });
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const statusText = error.response.statusText;
        let errorMessage = `Server error: ${status} - ${statusText}`;
        
        // Try to extract error message from response body
        if (error.response.data) {
          console.log('Error response data:', error.response.data);
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        }
        
        throw new Error(errorMessage);
      } else if (error.request) {
        // Network error
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        // Other error
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  }

  // Fetch week listing data
  async getWeekListing(empId: number): Promise<WeekListingResponse[]> {
    try {
      // console.log(`Fetching week listing data for empId: ${empId}`);
      // console.log(`API URL: ${this.baseURL}/e/weeklisting/${empId}`);
      const response = await this.axiosInstance.get<WeekListingResponse[]>(
        `${this.baseURL}/e/weeklisting/${empId}`
      );
      // console.log('Week Listing API Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching week listing data:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response,
        request: error.request,
        config: error.config
      });
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      if (error.response) {
        // Server responded with error status
        throw new Error(`Server error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        // Network error
        throw new Error(`Network error. Please check your connection and try again. URL: ${this.baseURL}/e/weeklisting/${empId}`);
      } else {
        // Other error
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  }

  // Get WS Row data
  async getWsRow(requestData: GetWsRowRequest): Promise<GetWsRowResponse> {
    try {
      // console.log('Calling getwsrow API with data:', requestData);
      // console.log(`API URL: ${this.baseURL}/e/getwsrow`);
      const response = await this.axiosInstance.post<GetWsRowResponse>(
        `${this.baseURL}/e/getwsrow`,
        requestData
      );
      // console.log('Get WS Row API Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error calling getwsrow API:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response,
        request: error.request,
        config: error.config
      });
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const statusText = error.response.statusText;
        let errorMessage = `Server error: ${status} - ${statusText}`;
        
        // Try to extract error message from response body
        if (error.response.data) {
          console.log('Error response data:', error.response.data);
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        }
        
        throw new Error(errorMessage);
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
      Efforts: data.ws_efforts,
      Status: data.ws_status === 'U' ? 'In-Progress' : 'Completed'
    };
  }

  // Transform week listing response to table row format
  transformWeekListingToTableRows(data: WeekListingResponse[]): WeekDetailsRow[] {
    console.log('Transforming week listing data:', data);
    return data.map((item, index) => {
      console.log(`Processing item ${index}:`, item);
      
      // Determine status based on week_status from API response
      let status = item.week_status || 'NA';
      
      return {
        weekStart: item.week_start_date || '',
        weekEnd: item.week_end_date || '',
        WD: (item.week_working_days || 0).toString(),
        H: (item.week_holidays || 0).toString(),
        L: (item.week_leaves || 0).toString(),
        WFH: (item.week_WFH || 0).toString(),
        WFO: (item.week_WFO || 0).toString(),
        ED: (item.week_extra_days || 0).toString(),
        Efforts: item.week_efforts || 0,
        Status: status,
        week_id: item.week_id,
        emp_id: item.week_emp_id,
        emp_code: item.week_emp_code,
        week_number: item.week_number
      };
    });
  }

  // Test API connectivity
  async testConnection(): Promise<boolean> {
    try {
      // console.log('Testing API connection...');
      // console.log(`Base URL: ${this.baseURL}`);
      const response = await this.axiosInstance.get(`${this.baseURL}/health`);
      console.log('API connection successful:', response.status);
      return true;
    } catch (error: any) {
      console.error('API connection failed:', error);
      return false;
    }
  }

  // Test freshweek API endpoint
  async testFreshWeekAPI(empId: number, weekId: number): Promise<void> {
    try {
      console.log(`Testing freshweek API for empId: ${empId}, weekId: ${weekId}`);
      console.log(`API URL: ${this.baseURL}/e/freshweek/${empId}/${weekId}`);
      
      const response = await this.axiosInstance.get(
        `${this.baseURL}/e/freshweek/${empId}/${weekId}`,
        { 
          validateStatus: function (status) {
            return status < 500; // Accept all status codes less than 500
          }
        }
      );
      
      console.log('Raw API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });
      
    } catch (error: any) {
      console.error('Test API Error:', error);
      console.error('Error response data:', error.response?.data);
    }
  }

  // Get current base URL for debugging
  getBaseURL(): string {
    return this.baseURL;
  }
}

export const apiService = new ApiService();
export default apiService;