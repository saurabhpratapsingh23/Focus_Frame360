# API Integration for RolesPopScreen Component

## Overview
The RolesPopScreen component has been integrated with the freshweek API endpoint to fetch and display weekly data dynamically.

## API Endpoint
- **URL**: `http://localhost:8081/pms/api/e/freshweek/{empId}/{weekId}`
- **Method**: GET
- **Parameters**: 
  - `empId`: Employee ID (number)
  - `weekId`: Week ID (number)

## API Response Structure
```json
{
  "ws_emp_id": 5,
  "ws_emp_code": "",
  "ws_start_date": "14-Sep",
  "ws_end_date": "20-Sep",
  "ws_success": "",
  "ws_challenges": "",
  "ws_unfinished_tasks": "",
  "ws_next_actions": "",
  "ws_work_days": 5,
  "ws_WFH": 0,
  "ws_WFO": 0,
  "ws_efforts": 0,
  "ws_leaves": 0,
  "ws_Holidays": 0,
  "ws_extra_days": 0,
  "ws_submitted_on": "31-00-2025",
  "ws_status": "U",
  "ws_week_number": 38,
  "ws_co_id": 1,
  "ws_week_id": 24,
  "ws_available_hours": 45,
  "ws_created_on": "31-00-2025",
  "ws_active_status": "1"
}
```

## Implementation Details

### Files Modified/Created:

1. **`src/lib/apiService.ts`** (New)
   - API service class with TypeScript interfaces
   - Error handling and timeout configuration
   - Data transformation utilities

2. **`src/components/RolesPopScreen.tsx`** (Modified)
   - Added React hooks for state management
   - Integrated API call with loading and error states
   - Added retry functionality
   - Improved UI with loading spinner and error messages

3. **`src/pages/emsPerformance.tsx`** (Modified)
   - Added state management for selected employee and week IDs
   - Updated component props to pass empId and weekId
   - Enhanced button click handler to set appropriate IDs

### Key Features:

1. **Automatic Data Fetching**: When the popup opens, it automatically fetches data from the API
2. **Error Handling**: Comprehensive error handling with user-friendly messages
3. **Loading States**: Loading spinner while fetching data
4. **Retry Functionality**: Users can retry failed requests
5. **Fallback Data**: Shows dummy data if API fails
6. **TypeScript Support**: Full type safety with interfaces

### Usage:

The component now accepts these props:
```typescript
interface RolesPopScreenProps {
  isOpen: boolean;
  onClose: () => void;
  weekDetails?: WeekDetailsRow[];
  empId?: number;  // Default: 13
  weekId?: number; // Default: 14
}
```

### Error Scenarios Handled:

1. **Network Errors**: Connection issues, timeouts
2. **Server Errors**: 4xx, 5xx status codes
3. **Invalid Data**: Malformed responses
4. **Missing Data**: Empty or null responses

### Data Transformation:

The API response is transformed to match the table structure:
- `ws_start_date` → `weekStart`
- `ws_end_date` → `weekEnd`
- `ws_work_days` → `WD`
- `ws_Holidays` → `H`
- `ws_leaves` → `L`
- `ws_WFH` → `WFH`
- `ws_WFO` → `WFO`
- `ws_extra_days` → `ED`
- `ws_efforts` + `ws_available_hours` → `Efforts`
- `ws_status` → `Status` (U = "In-Progress", else "Completed")

## Testing

To test the integration:

1. Ensure the API server is running on `http://localhost:8081`
2. Open the application and navigate to the performance page
3. Click "Edit Weekly Data" button
4. The popup should fetch and display data from the API
5. Check browser console for API request/response logs

## Future Enhancements

1. Add caching for API responses
2. Implement real-time data updates
3. Add data validation
4. Support for multiple week selection
5. Add export functionality for weekly data