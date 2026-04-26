import { createClient } from "@sanity/client";
import createImageUrlBuilder from "@sanity/image-url";
import { toast } from "sonner";

// You can replace this with your actual Sanity Project ID (8 characters)
const FALLBACK_PROJECT_ID = "dkoolqlp"; 

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || FALLBACK_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  useCdn: true,
  apiVersion: "2024-04-25",
  token: import.meta.env.VITE_SANITY_TOKEN,
});

const isUsingFallbackProject = !import.meta.env.VITE_SANITY_PROJECT_ID || import.meta.env.VITE_SANITY_PROJECT_ID === "YOUR_PROJECT_ID";

if (typeof window !== "undefined" && import.meta.env.DEV) {
  const currentPid = client.config().projectId;
  console.debug("Sanity Configuration:", {
    projectId: currentPid,
    dataset: client.config().dataset,
    hasToken: !!import.meta.env.VITE_SANITY_TOKEN,
    isFallbackMode: isUsingFallbackProject || currentPid === FALLBACK_PROJECT_ID
  });
}

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// Standard GROQ Queries with better robustness
export const queries = {
  menuItems: `*[_type == "menuItem"] | order(category asc)`,
  activeDeals: `*[_type == "deal" && isActive == true && (!defined(validUntil) || validUntil >= now())]`,
  specialMenuItems: `*[_type == "menuItem" && (isSpecial == true || isSpecial == "true")][0...3]`,
  gallery: `*[_type == "galleryItem"]`,
  testimonials: `*[_type == "testimonial"]`,
  orders: `*[_type == "order"] | order(_createdAt desc) {
    ...,
    items[] {
      ...,
      menuItem-> { name, price }
    }
  }`,
};

export const MOCK_DATA = {
  menuItems: [
    {
      _id: "m1",
      name: "Grilled Salmon",
      category: "Main Course",
      price: 3200,
      description: "Scottish salmon with saffron risotto and glazed asparagus.",
      isAvailable: true,
      isSpecial: true,
      image: null
    },
    {
      _id: "m2",
      name: "Truffle Pasta",
      category: "Main Course",
      price: 2400,
      description: "Handmade fettuccine with black truffle cream and parmesan.",
      isAvailable: true,
      isSpecial: false,
      image: null
    },
    {
      _id: "m3",
      name: "Rose Water Kheer",
      category: "Deserts",
      price: 850,
      description: "Traditional rice pudding infused with organic rose petals.",
      isAvailable: true,
      isSpecial: true,
      image: null
    }
  ],
  deals: [
    {
      _id: "d1",
      title: "Royal Welcome",
      description: "Get a 20% discount on your first dine-in experience.",
      discount: "20% OFF",
      isActive: true,
      image: null
    }
  ],
  gallery: [
    {
      _id: "g1",
      title: "Chef's Signature Plating",
      category: "Food",
      imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80"
    },
    {
      _id: "g2",
      title: "The Golden Hall",
      category: "Ambiance",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80"
    },
    {
      _id: "g3",
      title: "Handcrafted Cocktails",
      category: "Drinks",
      imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80"
    },
    {
      _id: "g4",
      title: "Private Dining Suite",
      category: "Ambiance",
      imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80"
    }
  ],
  orders: []
};

/**
 * Robust fetcher that falls back to mock data on network errors or empty results.
 */
export async function safeFetch<T>(query: string, mockKey: keyof typeof MOCK_DATA, filter?: (item: any) => boolean): Promise<T[]> {
  try {
    const result = await client.fetch(query);
    
    if (result && Array.isArray(result) && result.length > 0) {
      return result as T[];
    }
    
    if (typeof window !== "undefined" && Array.isArray(result) && result.length === 0) {
      console.info(`Sanity Fetch [${mockKey}]: Query returned 0 results. Using mock data fallback.`);
    }
  } catch (error: any) {
    const msg = error.message || String(error);
    const isProjectMissing = 
      msg.includes("Project not found") || 
      msg.includes("404") || 
      msg.includes("network") ||
      msg.includes("Request error") ||
      msg.includes("fetch") ||
      msg.includes("Failed to fetch") ||
      msg.includes("DNS") ||
      msg.includes("opaque");
    
    // Determine if we should suppress the error log
    const currentPid = client.config().projectId;
    const isActuallyFallback = currentPid === FALLBACK_PROJECT_ID || currentPid === "YOUR_PROJECT_ID";
    const shouldSuppress = (isUsingFallbackProject || isActuallyFallback) && isProjectMissing;

    if (!shouldSuppress) {
      // For real projects, we want to know about errors
      console.error(`Sanity Fetch Error [${mockKey}]:`, msg);
      
      if (typeof window !== "undefined") {
        toast.error(`The Archive is temporarily inaccessible. Using cached records.`, {
          description: "Verify your network connection or Sanity Project ID.",
          duration: 5000,
        });
      }
    } else {
      // Quiet mode for fallback/missing project - only log debug info
      if (import.meta.env.DEV) {
        console.debug(`Sanity [${mockKey}]: Fetch failed (expected for fallback). Error: ${msg.substring(0, 70)}...`);
      }
    }
  }
  
  const mockData = (MOCK_DATA[mockKey] || []) as any[];
  const result = (filter ? mockData.filter(filter) : mockData) as T[];
  return result;
}
