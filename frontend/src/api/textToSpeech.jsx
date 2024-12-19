import { API_BASE_URL } from "../configs/constants";

export const generateSpeech = async (text, speakerProfile) => {
    const response = await fetch(`${API_BASE_URL}/text-to-speech`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text,
            speakerProfile,
        }),
    });

    if (!response.ok) {
        throw new Error("Text-to-speech generation failed");
    }

    return response.json();
};
