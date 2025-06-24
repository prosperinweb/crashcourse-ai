import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, generateObject } from "ai";
import { z } from "zod";

interface JsonSchemaProperty {
  type: string;
  items?: { type: string };
  enum?: string[];
  properties?: Record<string, JsonSchemaProperty>;
}

interface JsonSchema {
  type: string;
  properties?: Record<string, JsonSchemaProperty>;
  patternProperties?: Record<string, JsonSchemaProperty>;
  required?: string[];
}

/**
 * Call the Gemini API with a prompt and optional JSON schema for structured output
 * @param prompt - The prompt to send to the API
 * @param jsonSchema - Optional JSON schema for structured response
 * @returns Promise<string> - The response text from the API
 */
export const callGeminiAPI = async (
  prompt: string,
  jsonSchema: JsonSchema | null = null
): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY environment variable is not set");
  }

  try {
    // Create Google provider instance with API key
    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

    if (jsonSchema) {
      // Convert JSON schema to Zod schema (simplified approach)
      const zodSchema = createZodSchemaFromJsonSchema(jsonSchema);

      const result = await generateObject({
        model: google("gemini-1.5-flash", {
          structuredOutputs: false,
        }),
        schema: zodSchema,
        prompt: prompt,
      });

      return JSON.stringify(result.object);
    } else {
      // Generate regular text response
      const result = await generateText({
        model: google("gemini-1.5-flash"),
        prompt: prompt,
      });

      return result.text;
    }
  } catch (error: unknown) {
    console.error("Gemini API call error:", error);

    // Log more details for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Throw the error instead of returning an error string
    // This way the calling code can handle it properly
    throw new Error(
      `Gemini API call failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

/**
 * Helper function to convert JSON schema to Zod schema
 * This is a simplified implementation for the common schemas used in the app
 */
function createZodSchemaFromJsonSchema(jsonSchema: JsonSchema): z.ZodSchema {
  if (jsonSchema.type === "OBJECT") {
    const shape: Record<string, z.ZodSchema> = {};

    if (jsonSchema.properties) {
      for (const [key, value] of Object.entries(jsonSchema.properties)) {
        const prop = value;
        if (prop.type === "STRING") {
          shape[key] = z.string();
        } else if (prop.type === "ARRAY" && prop.items?.type === "STRING") {
          shape[key] = z.array(z.string());
        } else if (prop.type === "ARRAY" && prop.items?.type === "OBJECT") {
          // Handle arrays of objects
          const itemSchema = createZodSchemaFromJsonSchema(prop.items);
          shape[key] = z.array(itemSchema);
        } else if (prop.type === "OBJECT") {
          shape[key] = createZodSchemaFromJsonSchema(prop);
        } else if (prop.enum && prop.enum.length > 0) {
          shape[key] = z.enum(prop.enum as [string, ...string[]]);
        }
      }
    }

    // Handle pattern properties (for dynamic keys) - this is for course generation
    if (jsonSchema.patternProperties) {
      const patternKey = Object.keys(jsonSchema.patternProperties)[0];
      const patternValue = jsonSchema.patternProperties[patternKey];
      return z.record(z.string(), createZodSchemaFromJsonSchema(patternValue));
    }

    return z.object(shape);
  }

  // Fallback for unsupported schemas
  return z.any();
}
