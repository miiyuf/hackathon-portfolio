import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Type definition for price data structure (symbol -> price mapping)
interface PriceData {
    [symbol: string]: number;
}

// Context type definition with all required state properties
interface CurrentPricesContextType {
    prices: PriceData;
    loading: boolean;
    error: string | null;
    lastUpdated: Date | null;
}

// Create context with default empty values
const CurrentPricesContext = createContext<CurrentPricesContextType>({
    prices: {},
    loading: false,
    error: null,
    lastUpdated: null,
});

/**
 * Provider component that fetches and manages real-time stock prices
 * Updates prices automatically every 30 seconds
 */
export const CurrentPricesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // State for storing current stock prices
    const [prices, setPrices] = useState<PriceData>({});
    // Loading state for API requests
    const [loading, setLoading] = useState<boolean>(false);
    // Error state for handling API failures
    const [error, setError] = useState<string | null>(null);
    // Timestamp for the last successful data update
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    /**
     * Fetches current stock prices from the API
     * Updates state based on the response
     */
    const fetchPrices = async () => {
        console.log("[CurrentPrices] Starting price data fetch...");
        setLoading(true);
        
        try {
            // API call to backend endpoint
            const startTime = performance.now();
            const response = await axios.get<PriceData>('http://localhost:8000/api/current-prices');
            const endTime = performance.now();
            
            // Process successful response
            const priceCount = Object.keys(response.data).length;
            console.log(`[CurrentPrices] Successfully fetched ${priceCount} stock prices in ${(endTime - startTime).toFixed(2)}ms`);
            
            // Update state with new data
            setPrices(response.data);
            setLastUpdated(new Date());
            setError(null);
            
            // Log some sample data if available
            if (priceCount > 0) {
                const sampleSymbols = Object.keys(response.data).slice(0, 3);
                console.log(`[CurrentPrices] Sample prices: ${sampleSymbols.map(sym => `${sym}: $${response.data[sym]}`).join(', ')}${priceCount > 3 ? '...' : ''}`);
            }
        } catch (err) {
            // Error handling with detailed logging
            console.error('[CurrentPrices] Error fetching stock prices:', err);
            setError('Failed to retrieve stock price data');
            
            // Provide more context about the error
            if (axios.isAxiosError(err)) {
                console.error(`[CurrentPrices] Network error: ${err.message}`);
                if (err.response) {
                    console.error(`[CurrentPrices] Server responded with status: ${err.response.status}`);
                }
            }
        } finally {
            setLoading(false);
            console.log("[CurrentPrices] Price fetch operation completed");
        }
    };

    // Effect to handle initial fetch and periodic updates
    useEffect(() => {
        console.log("[CurrentPrices] Setting up price monitoring...");
        
        // Initial data fetch
        fetchPrices();

        // Setup periodic updates every 30 seconds
        console.log("[CurrentPrices] Scheduling automatic updates every 30 seconds");
        const interval = setInterval(fetchPrices, 30000);
        
        // Cleanup function to prevent memory leaks
        return () => {
            console.log("[CurrentPrices] Cleaning up price monitoring...");
            clearInterval(interval);
        };
    }, []);

    // Provide context value to consumers
    return (
        <CurrentPricesContext.Provider value={{ prices, loading, error, lastUpdated }}>
            {children}
        </CurrentPricesContext.Provider>
    );
};

/**
 * Custom hook for consuming the current prices context
 * @returns Current prices context value
 */
export const useCurrentPrices = () => useContext(CurrentPricesContext);