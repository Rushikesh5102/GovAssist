import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Check, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const UploadPage = () => {
    const { t } = useTranslation();
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState({}); // { fileName: 'success' | 'error' }
    const [analyzeAll, setAnalyzeAll] = useState(true);
    const [analysisResults, setAnalysisResults] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const removeFile = (name) => {
        setFiles(files.filter(f => f.name !== name));
        const newStatus = { ...uploadStatus };
        delete newStatus[name];
        setUploadStatus(newStatus);
    };

    const handleUpload = async () => {
        setUploading(true);

        for (const file of files) {
            if (uploadStatus[file.name] === 'success') continue;

            const formData = new FormData();
            formData.append('file', file);

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/upload?analyze=${analyzeAll}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
                    if (data.analysis) {
                        setAnalysisResults(data.analysis);
                    }
                } else {
                    setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
                }
            } catch (error) {
                setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
            }
        }
        setUploading(false);
    };

    return (
        <div className="p-6 md:p-8 h-full">
            <div className="max-w-3xl mx-auto glass-panel p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('upload.title')}</h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        {t('upload.subtitle')}
                    </p>
                </div>

                {/* Dropzone */}
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${isDragActive
                        ? 'border-saffron bg-saffron-glass'
                        : 'border-gray-300 dark:border-glass-border hover:border-saffron/50 bg-gray-50 dark:bg-glass-white hover:bg-gray-100 dark:hover:bg-glass-whiteHover'
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-sm dark:shadow-none">
                        <Upload className="text-saffron" size={32} />
                    </div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                        {isDragActive ? t('upload.dropzone.active') : t('upload.dropzone.inactive')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {t('upload.dropzone.support')}
                    </p>
                </div>

                {/* AI Analysis Toggle */}
                <div className="mt-6 p-4 rounded-xl border border-indiaGreen/30 bg-indiaGreen-glass/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indiaGreen/10 flex items-center justify-center text-indiaGreen">
                            <Check className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">AI Smart Analysis</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 italic">Extract profile data (Income, Occupation) for better matches.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={analyzeAll}
                            onChange={() => setAnalyzeAll(!analyzeAll)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indiaGreen"></div>
                    </label>
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div className="mt-8 space-y-4">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {t('upload.selected_files')} ({files.length})
                        </h3>
                        <div className="space-y-3">
                            {files.map((file) => (
                                <div key={file.name} className="bg-white dark:bg-white/5 rounded-lg p-4 flex items-center justify-between border border-gray-200 dark:border-white/10 backdrop-blur-sm">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-200 dark:border-white/10">
                                            <File className="text-blue-600 dark:text-blue-400" size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {uploadStatus[file.name] === 'success' && (
                                            <span className="text-green-600 dark:text-green-400 flex items-center gap-1 text-xs font-medium">
                                                <Check size={14} /> {t('upload.status.uploaded')}
                                            </span>
                                        )}
                                        {uploadStatus[file.name] === 'error' && (
                                            <span className="text-red-600 dark:text-red-400 flex items-center gap-1 text-xs font-medium">
                                                <AlertCircle size={14} /> {t('upload.status.failed')}
                                            </span>
                                        )}

                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFile(file.name); }}
                                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>


                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleUpload}
                                disabled={uploading || files.length === 0}
                                className="glass-button-primary px-6 py-2.5 rounded-lg transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center gap-2"
                            >
                                {uploading ? t('upload.btn_uploading') : t('upload.btn_upload_all')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Analysis Results Feedback */}
                {analysisResults && (
                    <div className="mt-8 p-6 rounded-2xl border border-indiaGreen/30 bg-indiaGreen-glass/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Check className="text-indiaGreen" /> AI Extraction Success!
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(analysisResults).map(([key, value]) => (
                                value && key !== 'location' && (
                                    <div key={key} className="bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-gray-100 dark:border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">{key.replace('_', ' ')}</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{String(value)}</p>
                                    </div>
                                )
                            ))}
                        </div>
                        <p className="mt-4 text-xs text-gray-500 italic">Your profile has been updated. You can see your custom scheme recommendations on your profile page.</p>
                    </div>
                )}
            </div>
        </div >
    );
};

export default UploadPage;
