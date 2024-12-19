import React from "react";
import useSpeakerVerification from "../../../hooks/useSpeakerVerification";
import { models } from "../../../api/speakerVerification";
import "./SpeakerVerification.css";
import { MAX_FILE_SIZE } from "../../../configs/constant";

const SpeakerVerification = () => {
    const {
        firstAudio,
        secondAudio,
        result,
        isLoading,
        modelType,
        handleFirstAudioChange,
        handleSecondAudioChange,
        handleModelChange,
        handleSubmit,
    } = useSpeakerVerification();

    return (
        <div className="speaker-verification">
            <h1>Speaker Verification</h1>
            <form onSubmit={handleSubmit} className="upload-form">
                <div className="form-group">
                    <label htmlFor="first-audio">
                        First Speaker Audio (WAV, MP3, OGG - Max {MAX_FILE_SIZE / (1024 * 1024)}MB):
                    </label>
                    <input
                        type="file"
                        id="first-audio"
                        accept=".wav,.mp3,.ogg,audio/wav,audio/mpeg,audio/mp3,audio/ogg"
                        onChange={handleFirstAudioChange}
                        disabled={isLoading}
                    />
                    <small className="file-info">
                        Supported formats: WAV, MP3, OGG
                        <br />
                        Maximum file size: {MAX_FILE_SIZE / (1024 * 1024)}MB
                    </small>
                </div>
                <div className="form-group">
                    <label htmlFor="second-audio">
                        Second Speaker Audio (WAV, MP3, OGG - Max {MAX_FILE_SIZE / (1024 * 1024)}MB):
                    </label>
                    <input
                        type="file"
                        id="second-audio"
                        accept=".wav,.mp3,.ogg,audio/wav,audio/mpeg,audio/mp3,audio/ogg"
                        onChange={handleSecondAudioChange}
                        disabled={isLoading}
                    />
                    <small className="file-info">
                        Supported formats: WAV, MP3, OGG
                        <br />
                        Maximum file size: {MAX_FILE_SIZE / (1024 * 1024)}MB
                    </small>
                </div>
                <div className="form-group">
                    <label htmlFor="model-select">Select Model:</label>
                    <select 
                        id="model-select" 
                        value={modelType} 
                        onChange={handleModelChange}
                    >
                        {models.map((model) => (
                            <option key={model.value} value={model.value}>
                                {model.displayName}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Compare Speakers"}
                </button>
            </form>

            {result && (
                <div className="results">
                    <h2>Results</h2>
                    <div className="similarity-score">
                        <h3>{(result.similarity_score * 100).toFixed(2)}% Similar</h3>
                        <div className="progress-bar-container">
                            <div className="scale-marks">
                                <span>0</span>
                                <span>20</span>
                                <span>40</span>
                                <span>60</span>
                                <span>80</span>
                                <span>100</span>
                            </div>
                            <div 
                                className="progress-bar" 
                                style={{ '--progress-width': `${(result.similarity_score * 100)}%` }}
                            >
                                <span className="progress-label">
                                    {(result.similarity_score * 100).toFixed(2)}%
                                </span>
                            </div>
                        </div>
                        <div className="processing-info">
                            <div className="info-item">
                                <span className="info-label">Processing Time:</span>
                                <span className="info-value">{result.duration.toFixed(2)}s</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Model Used:</span>
                                <span className="info-value">{result.model_type}</span>
                            </div>
                        </div>
                    </div>
                    <div className="audio-comparison">
                        <div className="audio-section">
                            <h3>First Speaker</h3>
                            <div className="audio-player">
                                <p>Original Audio:</p>
                                <audio 
                                    controls 
                                    src={firstAudio ? URL.createObjectURL(firstAudio) : ""} 
                                />
                            </div>
                            <div className="audio-player">
                                <p>Audio after silence removal:</p>
                                <audio 
                                    controls 
                                    src={`data:audio/wav;base64,${result.first_clean_audio}`} 
                                />
                            </div>
                            <div className="spectrogram">
                                <p>Mel Spectrogram:</p>
                                <img 
                                    src={`data:image/png;base64,${result.first_mel_spectrogram}`}
                                    alt="First Speaker Mel Spectrogram"
                                />
                            </div>
                        </div>
                        <div className="audio-section">
                            <h3>Second Speaker</h3>
                            <div className="audio-player">
                                <p>Original Audio:</p>
                                <audio 
                                    controls 
                                    src={secondAudio ? URL.createObjectURL(secondAudio) : ""} 
                                />
                            </div>
                            <div className="audio-player">
                                <p>Audio after silence removal:</p>
                                <audio 
                                    controls 
                                    src={`data:audio/wav;base64,${result.second_clean_audio}`} 
                                />
                            </div>
                            <div className="spectrogram">
                                <p>Mel Spectrogram:</p>
                                <img 
                                    src={`data:image/png;base64,${result.second_mel_spectrogram}`}
                                    alt="Second Speaker Mel Spectrogram"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpeakerVerification; 