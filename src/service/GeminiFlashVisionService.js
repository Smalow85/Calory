import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import { Buffer } from 'buffer';

export const analyzeMealImage = async (userId, imageUri) => {

        const imageResponse = await fetch(imageUri);
        const imageBlob = await imageResponse.blob();
        const arrayBuffer = await imageBlob.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString('base64');

        console.log(base64Image)
        const headers = {
            "Content-Type": "application/json"
        };

        // Prepare the request body
        const requestBody = {
            'contents': [
                {
                    'parts': [
                        {
                            'text': 'You are an expert in nutrition. Please, analyze calories count for the food on the image. Try to correctly estimate food size and type. Your response should be in json format'
                        },
                        {
                            'inline_data': {
                                'mime_type': 'image/jpeg',
                                'data': base64Image
                            }
                        }
                    ]
                }
            ]
        };

        console.log(requestBody)

        // Create the full URL
        const URL = `${apiUrl}${apiKey}`;

        try {
            // Send POST request
            const response = await fetch(URL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody)
            });

            const apiResponse = await response.json();
            console.log(apiResponse)
            const text = apiResponse.candidates[0].content.parts[0].text;

            // Normalize the text
            const normalizedText = text.replace('/^[^{]*|[^}]*$/g', '');

            // Parse the normalized JSON
            const data = JSON.parse(normalizedText);
            data.userId = userId; // Add userId to the data
            data.base64image = resizeAndConvertToBase64(image, 64, 64); // Implement this function

            // Convert data back to JSON string
            const finalDataString = JSON.stringify(data);
            console.log(finalDataString); // Use this or return as needed

        } catch (error) {
            console.error('Error:', error);
        }
};