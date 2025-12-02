import { API_BASE_URL } from '../config/constants';

// A more robust API call function to handle non-JSON and empty responses.
export const callApi = async (url, method = 'GET', body = null, silent = false) => {
    const isBodyMethod = !['GET', 'HEAD'].includes(method.toUpperCase());

    const options = {
        method,
        headers: { 
            'Accept': 'application/json',
            // Only set 'Content-Type' for methods that are supposed to send a body
            ...(isBodyMethod && body && { 'Content-Type': 'application/json' })
        },
    };

    if (body) { 
        if (isBodyMethod) {
            // Only add body to POST, PUT, DELETE, etc.
            options.body = JSON.stringify(body); 
        } else {
            // IMPROVEMENT 1: Log an error if a body is passed to a GET/HEAD request
            console.warn(`Warning: Body provided for ${method} request to ${url}. Ignoring body.`);
        }
    }

    try {
        const fullUrl = `${API_BASE_URL}${url}`;
        const response = await fetch(fullUrl, options);
        
        const contentType = response.headers.get('content-type');
        
        // --- 1. Handle Successful Responses with No Content (e.g., 204) ---
        if (response.status === 204 || response.status === 304) {
             return { success: true, message: 'No content to return.' };
        }

        // --- 2. Safely read the response body ---
        let responseBody;
        
        // If content type is not JSON, try to read as text first.
        if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await response.text(); 
            
            if (!response.ok && textResponse.trim().startsWith('<!DOCTYPE')) {
                // If it's a non-successful status AND an HTML page
                throw new Error(`Server Error (${response.status}): The server returned an HTML page (likely a login, proxy, or 5xx error) instead of JSON for endpoint ${url}.`);
            }
            
            // If the server returns text or HTML on a successful status, return the text
            if (response.ok) {
                responseBody = textResponse;
            } else {
                // If the server returns text/non-JSON on a bad status (but not HTML), throw a generic error
                 throw new Error(`Unexpected non-JSON server response type (${contentType}). Status: ${response.status}. Response: ${textResponse.substring(0, 100)}`);
            }
        } else {
            // It is JSON. IMPROVEMENT 2: Read stream safely to avoid SyntaxError on empty JSON
            const text = await response.text();
            responseBody = text ? JSON.parse(text) : {};
        }
        
        // --- 3. Check HTTP status code for errors (4xx, 5xx) ---
        if (!response.ok) {
            // If response is not OK, extract the error message from the parsed JSON/text
            // Prioritize data.message if JSON, or use the string if it was plain text.
            const errorMessage = (responseBody && responseBody.message) 
                                 || (typeof responseBody === 'string' ? responseBody : null)
                                 || `API call failed with status ${response.status}.`;
            throw new Error(errorMessage);
        }

        // For successful requests, return the parsed body
        return responseBody;

    } catch (error) {
        console.error("API Call Error:", error);
        // Use console.error for logging and alert for user notification (unless silent)
        if (!silent) {
            alert(`❌ Data Error: ${error.message}. Please check network connection and server response.`);
        }
        return null;
    }
};