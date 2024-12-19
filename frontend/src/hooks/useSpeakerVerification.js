import { useState } from "react";
import { compareSpeakers } from "../api/speakerVerification";
import { MAX_FILE_SIZE } from "../configs/constant";

const useSpeakerVerification = () => {
    const [firstAudio, setFirstAudio] = useState(null);
    const [secondAudio, setSecondAudio] = useState(null);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modelType, setModelType] = useState("lstm");

    const validateAudioFile = (file, inputName) => {
        if (file.size > MAX_FILE_SIZE) {
            alert(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB. Your ${inputName}: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
            return false;
        }

        const allowedTypes = ['audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg'];
        if (!allowedTypes.includes(file.type)) {
            alert(`Please select a valid audio file (WAV, MP3, or OGG). Your ${inputName}: ${file.name} (${file.type})`);
            return false;
        }
        return true;
    };

    const handleFirstAudioChange = (e) => {
        const file = e.target.files[0];
        if (file && validateAudioFile(file, "first audio")) {
            setFirstAudio(file);
        } else {
            e.target.value = '';
        }
    };

    const handleSecondAudioChange = (e) => {
        const file = e.target.files[0];
        if (file && validateAudioFile(file, "second audio")) {
            setSecondAudio(file);
        } else {
            e.target.value = '';
        }
    };

    const handleModelChange = (e) => {
        setModelType(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!firstAudio || !secondAudio) {
            alert("Please upload both audio files.");
            return;
        }

        const formData = new FormData();
        formData.append("first_audio", firstAudio);
        formData.append("second_audio", secondAudio);

        try {
            setIsLoading(true);
            const data = await compareSpeakers(formData, modelType);
            setResult(data);
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        firstAudio,
        secondAudio,
        result,
        isLoading,
        modelType,
        handleFirstAudioChange,
        handleSecondAudioChange,
        handleModelChange,
        handleSubmit,
    };
};

export default useSpeakerVerification; 