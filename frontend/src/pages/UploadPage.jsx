import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Check, AlertCircle } from 'lucide-react';

const UploadPage = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState({}); // { fileName: 'success' | 'error' }

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
                const response = await fetch('/api/upload/', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
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
                    <h1 className="text-3xl font-bold text-white mb-2">Upload Documents</h1>
                    <p className="text-gray-300">
                        Upload government documents (PDF, Images) to add them to the knowledge base.
                    </p>
                </div>

                {/* Dropzone */}
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${isDragActive
                        ? 'border-saffron bg-saffron-glass'
                        : 'border-glass-border hover:border-saffron/50 bg-glass-white hover:bg-glass-whiteHover'
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Upload className="text-saffron" size={32} />
                    </div>
                    <p className="text-lg font-medium text-white">
                        {isDragActive ? "Drop files here..." : "Drag & drop files here, or click to select"}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        Supports PDF, JPG, PNG (Max 10MB)
                    </p>
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div className="mt-8 space-y-4">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            Selected Files ({files.length})
                        </h3>
                        <div className="space-y-3">
                            {files.map((file) => (
                                <div key={file.name} className="bg-white/5 rounded-lg p-4 flex items-center justify-between border border-white/10 backdrop-blur-sm">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-10 h-10 bg-navy/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-navy-light/30">
                                            <File className="text-blue-400" size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{file.name}</p>
                                            <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {uploadStatus[file.name] === 'success' && (
                                            <span className="text-green-400 flex items-center gap-1 text-xs font-medium">
                                                <Check size={14} /> Uploaded
                                            </span>
                                        )}
                                        {uploadStatus[file.name] === 'error' && (
                                            <span className="text-red-400 flex items-center gap-1 text-xs font-medium">
                                                <AlertCircle size={14} /> Failed
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
                                {uploading ? 'Uploading...' : 'Upload All Files'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadPage;
