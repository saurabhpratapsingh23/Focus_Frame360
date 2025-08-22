
export interface GoalsListing {
    id: number,
    division: string,
    division_code: string,
    division_id: number,
    goal_id: string,
    goal_title: string,
    description: string,
    target_value: string,
    unit_of_measure: string,
    period: string,
    data_source_description: string,
    red_threshold: string,
    orange_threshold: string,
    co_id: number,
    active_status: string
};

// Fetch goals for the current employee using empID from sessionStorage
export async function fetchEmployeeGoals() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    let empID = null;
    try {
        const currentUser = sessionStorage.getItem("currentUser");
        if (currentUser) {
            try {
                const parsed = JSON.parse(currentUser);
                empID = parsed.e_emp_id || null;
            } catch {
                empID = currentUser;
            }
        }
    } catch {
        empID = null;
    }
    if (!empID) throw new Error("No empID found");
    const response = await fetch(`${apiBaseUrl}/pms/api/e/goals/${empID}`);
    if (!response.ok) throw new Error(`Failed to fetch goals: ${response.status}`);
    return response.json();
}






