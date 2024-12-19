import { useState } from "react";
import { fetchVoiceEnhancement } from "../api/voiceEnhancement";
import { VOICE_ENHANCEMENT_DEFAULT_MODEL } from "../configs/constant";
import { MAX_FILE_SIZE } from "../configs/constant";

const useVoiceEnhancement = () => {
    const [rawAudio, setRawAudio] = useState(null);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modelName, setModelName] = useState(VOICE_ENHANCEMENT_DEFAULT_MODEL);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size
            if (file.size > MAX_FILE_SIZE) {
                alert(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB. Your file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
                e.target.value = '';
                return;
            }

            // Check file type
            const allowedTypes = ['audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg'];
            if (!allowedTypes.includes(file.type)) {
                alert(`Please select a valid audio file (WAV, MP3, or OGG). Your file: ${file.name} (${file.type})`);
                e.target.value = '';
                return;
            }

            setRawAudio(file);
        }
    };

    const handleModelChange = (e) => {
        setModelName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rawAudio) {
            alert("Please upload an audio file.");
            return;
        }

        const formData = new FormData();
        formData.append("audio", rawAudio);

        try {
            setIsLoading(true);
            const data = await fetchVoiceEnhancement(formData, modelName);
            setResult(data);
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        rawAudio,
        result,
        isLoading,
        modelName,
        handleFileChange,
        handleModelChange,
        handleSubmit,
    };
};

export default useVoiceEnhancement;
