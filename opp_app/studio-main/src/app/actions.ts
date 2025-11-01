"use server";

import { getBusesByDestination } from "@/lib/data";

type SuggestionState = {
    suggestion: {
        bestBus: string;
        eta: string;
    } | null;
    error: string | null;
}

export async function getBestBusSuggestion(
    prevState: SuggestionState,
    formData: FormData
): Promise<SuggestionState> {
    const origin = formData.get("origin") as string;
    const destination = formData.get("destination") as string;

    if (!origin || !destination) {
        return { suggestion: null, error: "Please select both origin and destination." };
    }

    try {
        const buses = getBusesByDestination(destination);

        if (buses.length === 0) {
            return { suggestion: null, error: "Could not find a suitable bus." };
        }
        
        // Return the first bus as the "best" suggestion
        const bestBus = buses[0];

        return {
            suggestion: {
                bestBus: String(bestBus.number),
                eta: bestBus.eta,
            },
            error: null,
        };
    } catch (error) {
        console.error("Suggestion failed:", error);
        return { suggestion: null, error: "An unexpected error occurred. Please try again later." };
    }
}
