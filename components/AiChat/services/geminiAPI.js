import { GoogleGenerativeAI } from "@google/generative-ai"
import * as FileSystem from "expo-file-system"

// Initialize the Gemini AI client using the Expo-recommended prefix for env variables
// The 'EXPO_PUBLIC_' prefix ensures the variable is inlined during the build.
// If not found, it falls back to a placeholder.
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || "GEMINI_API_KEY_HERE")

// Get the Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

/**
 * Generate AI response from text input
 * @param {string} prompt - The user's message/question
 * @returns {Promise<string>} - AI generated response
 */
export const generateAIResponse = async (prompt) => {
  try {
    console.log("Generating AI response for:", prompt)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log("AI response generated successfully")
    return text
  } catch (error) {
    console.error("Error generating AI response:", error)

    // Fallback responses for different error types
    if (error.message?.includes("API_KEY")) {
      return "Sorry, I'm having trouble connecting to my AI service. Please check the API configuration."
    } else if (error.message?.includes("quota")) {
      return "I'm currently experiencing high demand. Please try again in a moment."
    } else if (error.message?.includes("network")) {
      return "I'm having network connectivity issues. Please check your internet connection and try again."
    } else {
      return "I apologize, but I'm having trouble processing your request right now. Please try again."
    }
  }
}

/**
 * Get MIME type from file extension
 * @param {string} uri - The file URI
 * @returns {string} - MIME type
 */
const getMimeType = (uri) => {
  const extension = uri.split(".").pop()?.toLowerCase()

  const mimeTypes = {
    // Image formats
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    bmp: "image/bmp",
    tiff: "image/tiff",
    tif: "image/tiff",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    heic: "image/heic",
    heif: "image/heif",
    // Video formats (if you want to support video thumbnails)
    mp4: "video/mp4",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    // Document formats (for future use)
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  }

  return mimeTypes[extension] || "image/jpeg" // Default to JPEG
}

/**
 * Convert image URI to base64 with proper MIME type detection
 * @param {string} imageUri - The image URI
 * @returns {Promise<{base64: string, mimeType: string}>} - Base64 encoded image with MIME type
 */
const convertImageToBase64 = async (imageUri) => {
  try {
    console.log("Converting image to base64:", imageUri)

    // Get MIME type from file extension
    const mimeType = getMimeType(imageUri)
    console.log("Detected MIME type:", mimeType)

    // Read file as base64 using Expo FileSystem
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    })

    console.log("Image converted to base64 successfully, length:", base64.length)

    return {
      base64,
      mimeType,
    }
  } catch (error) {
    console.error("Error converting image to base64:", error)
    throw new Error("Failed to process image. Please try again.")
  }
}

/**
 * Validate if the file is a supported image type
 * @param {string} uri - The file URI
 * @returns {boolean} - Whether the file is a supported image
 */
const isValidImageType = (uri) => {
  const supportedTypes = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "tiff", "tif", "heic", "heif"]

  const extension = uri.split(".").pop()?.toLowerCase()
  return supportedTypes.includes(extension)
}

/**
 * Generate AI response from image with optional text
 * @param {string} imageUri - The image URI
 * @param {string} prompt - Optional text prompt to go with the image
 * @returns {Promise<string>} - AI generated response
 */
export const generateAIResponseFromImage = async (
  imageUri,
  prompt = "What do you see in this image? Please provide a detailed description.",
) => {
  try {
    console.log("Generating AI response for image:", imageUri)

    // Validate image type
    if (!isValidImageType(imageUri)) {
      return "I can only analyze image files (JPG, PNG, GIF, WebP, BMP, TIFF, HEIC, HEIF). Please share a valid image file."
    }

    // Convert image to base64 with MIME type detection
    const { base64, mimeType } = await convertImageToBase64(imageUri)

    // Create image part for Gemini API
    const imagePart = {
      inlineData: {
        data: base64,
        mimeType: mimeType,
      },
    }

    // Generate content with both text and image
    const result = await model.generateContent([prompt, imagePart])
    const response = await result.response
    const text = response.text()

    console.log("AI image response generated successfully")
    return text
  } catch (error) {
    console.error("Error generating AI response from image:", error)

    // Handle specific error types
    if (error.message?.includes("Failed to process image")) {
      return error.message
    } else if (error.message?.includes("quota")) {
      return "I'm currently experiencing high demand for image analysis. Please try again in a moment."
    } else if (error.message?.includes("SAFETY")) {
      return "I cannot analyze this image due to safety guidelines. Please try a different image."
    } else {
      return "I can see you've shared an image, but I'm having trouble analyzing it right now. Could you describe what you'd like to know about it?"
    }
  }
}

/**
 * Generate contextual academic responses
 * @param {string} prompt - The user's academic question
 * @param {string} context - Additional context (optional)
 * @returns {Promise<string>} - AI generated academic response
 */
export const generateAcademicResponse = async (prompt, context = "") => {
  try {
    const academicPrompt = `You are an Academic Assistant AI. Please provide a helpful, accurate, and educational response to the following question. Keep your response clear, informative, and appropriate for academic learning.

${context ? `Context: ${context}\n\n` : ""}Question: ${prompt}

Please provide a comprehensive but concise answer:`

    const result = await model.generateContent(academicPrompt)
    const response = await result.response
    const text = response.text()

    return text
  } catch (error) {
    console.error("Error generating academic response:", error)
    return "I'm here to help with your academic questions, but I'm experiencing some technical difficulties right now. Please try rephrasing your question or try again in a moment."
  }
}

/**
 * Analyze multiple images at once
 * @param {string[]} imageUris - Array of image URIs
 * @param {string} prompt - Text prompt for analysis
 * @returns {Promise<string>} - AI generated response
 */
export const generateAIResponseFromMultipleImages = async (
  imageUris,
  prompt = "Please analyze and compare these images.",
) => {
  try {
    console.log("Generating AI response for multiple images:", imageUris.length)

    // Convert all images to base64
    const imageParts = []

    for (const imageUri of imageUris) {
      if (!isValidImageType(imageUri)) {
        continue // Skip invalid image types
      }

      try {
        const { base64, mimeType } = await convertImageToBase64(imageUri)
        imageParts.push({
          inlineData: {
            data: base64,
            mimeType: mimeType,
          },
        })
      } catch (error) {
        console.warn("Failed to process image:", imageUri, error)
        continue // Skip failed images
      }
    }

    if (imageParts.length === 0) {
      return "I couldn't process any of the images you shared. Please make sure they are valid image files."
    }

    // Generate content with text and all images
    const content = [prompt, ...imageParts]
    const result = await model.generateContent(content)
    const response = await result.response
    const text = response.text()

    console.log("AI multiple images response generated successfully")
    return text
  } catch (error) {
    console.error("Error generating AI response from multiple images:", error)
    return "I had trouble analyzing the images you shared. Please try again with fewer images or check that they are valid image files."
  }
}

/**
 * Get image information without AI analysis
 * @param {string} imageUri - The image URI
 * @returns {Promise<object>} - Image information
 */
export const getImageInfo = async (imageUri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(imageUri)
    const mimeType = getMimeType(imageUri)
    const extension = imageUri.split(".").pop()?.toLowerCase()

    return {
      exists: fileInfo.exists,
      size: fileInfo.size,
      mimeType: mimeType,
      extension: extension,
      isValidImage: isValidImageType(imageUri),
      uri: imageUri,
    }
  } catch (error) {
    console.error("Error getting image info:", error)
    return null
  }
}

export default {
  generateAIResponse,
  generateAIResponseFromImage,
  generateAcademicResponse,
  generateAIResponseFromMultipleImages,
  getImageInfo,
  isValidImageType,
  getMimeType,
}