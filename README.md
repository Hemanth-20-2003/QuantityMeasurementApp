#QuantityMeasurementApp
## UC-JS-01: Create JSON Server Database
This use case focuses on setting up the backend data layer using JSON Server by creating a db.json file with units, conversions, and history collections. It defines the schema for different measurement types and ensures proper structure for factor-based and formula-based conversions. This forms the foundation for all API interactions and enables persistent storage of calculation history.

## UC-JS-02: App Initialisation
This use case initializes the application when the page loads by setting up event listeners, default state, and loading initial data. It ensures dropdowns are populated, history is rendered, and UI elements are correctly configured. A centralized state object is used to manage user selections and maintain consistency across the app.

## UC-JS-03: Fetch Units by Type
This use case retrieves unit data from the JSON server based on the selected measurement type. It uses the Fetch API with query parameters to filter results server-side and returns an array of unit objects. Proper error handling ensures the app remains stable even if the request fails.

## UC-JS-04: Fetch Conversion Record
This use case fetches the conversion factor or formula for a specific unit pair from the server. Since JSON Server returns arrays, the function extracts the required object and validates its existence. It enables accurate conversions by providing the necessary data for calculations.

## UC-JS-05: Save to History
This use case stores each successful calculation into the history collection using a POST request. It records details such as type, action, expression, result, and timestamp. The history feature enhances user experience by maintaining a log of past operations.

## UC-JS-06: Load History
This use case retrieves all saved calculation records from the server, sorted by the latest first. It ensures that users can view their recent activities and provides a fallback for empty history scenarios. This supports transparency and tracking of operations.

## UC-JS-07: Apply Conversion
This use case performs the core conversion logic by applying either a multiplication factor or evaluating a formula string. It ensures accurate numerical results with proper rounding and handles special cases like same-unit conversions. This function is central to the app’s functionality.

## UC-JS-08: Compare Values
This use case compares two measurement values after normalizing them to a common base unit. It returns a human-readable result indicating whether one value is greater, lesser, or equal. This enhances usability by providing clear comparison outcomes.

## UC-JS-09: Perform Arithmetic
This use case executes arithmetic operations such as addition, subtraction, multiplication, and division on normalized values. It ensures proper handling of edge cases like division by zero and returns results with controlled precision. This extends the app beyond simple conversions.

## UC-JS-10: Populate Unit Dropdown
This use case dynamically fills dropdown menus with unit options retrieved from the server. It ensures a clean and user-friendly interface by adding a default prompt and handling empty datasets gracefully. It bridges API data with the UI.

## UC-JS-11: Set Active Button
This use case manages UI state by highlighting the selected button among a group of options. It ensures only one element is active at a time, improving visual feedback and user interaction clarity. This is essential for consistent UI behavior.

## UC-JS-12: Show Result
This use case updates the result panel with the calculated value and unit after a successful operation. It also triggers a highlight animation for better user feedback. It supports both numeric results and text-based comparison outputs.

## UC-JS-13: Toggle Operator Row
This use case controls the visibility of arithmetic operator buttons based on the selected action. It ensures that operators are shown only when needed, keeping the interface clean and context-aware. This improves usability and reduces confusion.

## UC-JS-14: Render History List
This use case displays the calculation history in the UI by dynamically creating list elements from stored records. It handles empty states and formats timestamps for readability. This provides users with a clear view of their past actions.

## UC-JS-15: Handle Type Card Click
This use case updates the application state when a user selects a measurement type. It reloads relevant units, resets inputs, and updates the UI accordingly. This ensures the app responds dynamically to user choices.

## UC-JS-16: Handle Action Tab Click
This use case switches between different modes such as conversion, comparison, and arithmetic. It updates the state, toggles UI elements, and resets results. This enables multi-functional behavior within a single interface.

## UC-JS-17: Execute Calculation
This use case orchestrates the entire calculation process by calling appropriate functions based on the selected action. It handles conversions, comparisons, and arithmetic operations, updates the result, saves history, and refreshes the UI. It also includes error handling to ensure smooth user experience even when issues occur.
