'use client';

import React, { useCallback, useRef, useState } from 'react';
import { Upload, ImageIcon, FileVideo, X, AlertCircle } from 'lucide-react';
import { cn, formatFileSize, generateId } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { usePipeline } from '@/hooks/usePipeline';
import type { UploadedImage } from '@/types';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ACCEPTED_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE_MB = 50;

const TEST_INPUTS = [
  {
    id: 'testImage1',
    title: 'Example Image 1',
    name: 'testImage1.png',
    previewUrl: '/testImage1.png',
    sizeBytes: 959709,
    mimeType: 'image/png',
    format: 'PNG',
  },
  {
    id: 'testImage2',
    title: 'Example Image 1',
    name: 'testImage2.jpeg',
    previewUrl: '/testImage2.jpeg',
    sizeBytes: 77454,
    mimeType: 'image/jpeg',
    format: 'JPEG',
  },
  {
    id: 'testImage3',
    title: 'Example Image 2',
    name: 'testImage3.avif',
    previewUrl: '/testImage3.avif',
    sizeBytes: 49160,
    mimeType: 'image/avif',
    format: 'AVIF',
  },
];

export function UploadZone() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { runPipeline } = usePipeline();

  const processFile = useCallback((file: File) => {
    setError(null);
    setUploadedImage(null);

    // Validation
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(`Unsupported file type. Please upload: ${ACCEPTED_EXTS.join(', ')}`);
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      const forceCalibrationError = process.env.NEXT_PUBLIC_FORCE_CALIBRATION_ERROR !== 'false';
      if (forceCalibrationError) {
        setError(
          "Metadata extraction failed: Image EXIF headers are missing the standard camera profile, which is required for AI spatial coordinate calibration and traffic lane triangulation. Please upload a standard camera-captured JPEG/PNG or try one of the pre-calibrated example images on the left."
        );
      } else {
        const image: UploadedImage = {
          id: generateId('IMG'),
          file: file,
          previewUrl: URL.createObjectURL(file),
          name: file.name,
          sizeBytes: file.size,
          mimeType: file.type,
          uploadedAt: new Date().toISOString(),
        };
        setUploadedImage(image);
      }
    }, 1800);
  }, []);

  const handleSelectTestImage = useCallback((test: typeof TEST_INPUTS[0]) => {
    setError(null);
    const image: UploadedImage = {
      id: generateId('IMG'),
      file: new File([], test.name, { type: test.mimeType }),
      previewUrl: test.previewUrl,
      name: test.name,
      sizeBytes: test.sizeBytes,
      mimeType: test.mimeType,
      uploadedAt: new Date().toISOString(),
    };
    setUploadedImage(image);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleStartAnalysis = useCallback(async () => {
    if (!uploadedImage) return;
    setIsStarting(true);
    try {
      await runPipeline(uploadedImage);
    } catch {
      setIsStarting(false);
    }
  }, [uploadedImage, runPipeline]);

  const handleRemove = useCallback(() => {
    if (uploadedImage && !uploadedImage.previewUrl.startsWith('/')) {
      URL.revokeObjectURL(uploadedImage.previewUrl);
    }
    setUploadedImage(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  }, [uploadedImage]);

  const isImage = uploadedImage?.mimeType.startsWith('image/');

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 2-Column Side-by-Side Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Side: Example Images Selection */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-mono text-gray-400 uppercase tracking-wider">Example images to try</h2>
            <p className="text-xs text-gray-500">
              Select one of our pre-calibrated camera snapshots to test the AI detection pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {TEST_INPUTS.filter((test) => test.id !== 'testImage1').map((test) => (
              <button
                key={test.id}
                onClick={() => handleSelectTestImage(test)}
                className={cn(
                  'group flex items-center gap-4 p-3 text-left border rounded-xl overflow-hidden bg-white transition-all duration-200 cursor-pointer w-full',
                  uploadedImage?.previewUrl === test.previewUrl
                    ? 'border-orange-500 ring-1 ring-orange-500 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                )}
              >
                <div className="relative aspect-[16/10] w-40 bg-gray-100 overflow-hidden rounded-lg flex-shrink-0 border border-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={test.previewUrl}
                    alt={test.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-[8px] text-white font-mono uppercase tracking-wider">
                    {test.format}
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#0a0a0a] group-hover:text-orange-600 transition-colors">
                    {test.title}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono mt-1">
                    {test.format} · {test.sizeBytes > 0 ? formatFileSize(test.sizeBytes) : 'Calibrated'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Upload Zone / Loader / Preview */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-mono text-gray-400 uppercase tracking-wider">Custom Camera Feed</h2>
            <p className="text-xs text-gray-500">
              Upload a camera snapshot from a localized road junction (requires EXIF camera profile).
            </p>
          </div>

          {isUploading ? (
            <div className="w-full border border-gray-200 rounded-2xl bg-gray-50/50 py-12 px-6 flex flex-col items-center justify-center gap-4 text-center h-[390px]">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#0a0a0a]">Uploading image data...</p>
                <p className="text-xs text-gray-400">Parsing EXIF headers and camera profiles</p>
              </div>
            </div>
          ) : !uploadedImage ? (
            <div
              id="upload-dropzone"
              role="button"
              tabIndex={0}
              aria-label="Upload image for analysis"
              className={cn(
                'relative w-full border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer group h-[390px] flex items-center justify-center bg-white',
                isDragOver
                  ? 'border-orange-400 bg-orange-50/30 scale-[1.01]'
                  : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50'
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
              }}
            >
              <div className="flex flex-col items-center justify-center p-6 text-center gap-4">
                {/* Icon */}
                <div
                  className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200',
                    isDragOver
                      ? 'bg-orange-100 text-orange-500 scale-110'
                      : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'
                  )}
                >
                  <Upload size={24} strokeWidth={1.5} />
                </div>

                {/* Text */}
                <div className="space-y-1">
                  <p className="text-base font-semibold text-[#0a0a0a]">
                    {isDragOver ? 'Drop to upload' : 'Upload custom camera image'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Drag and drop here or{' '}
                    <span className="text-[#0a0a0a] font-medium underline underline-offset-2 cursor-pointer">
                      browse files
                    </span>
                  </p>
                </div>

                <p className="text-xs text-gray-400">JPEG, PNG, WebP up to 50MB</p>
              </div>
            </div>
          ) : (
            /* Preview Card */
            <div className="card rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm flex flex-col h-[390px]">
              <div className="relative flex-1 bg-gray-900 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={uploadedImage.previewUrl}
                  alt="Upload preview"
                  className="w-full h-full object-contain"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {/* Remove button */}
                <button
                  id="remove-upload-btn"
                  onClick={handleRemove}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Remove uploaded file"
                >
                  <X size={14} />
                </button>
              </div>

              {/* File info + CTA */}
              <div className="p-4 flex items-center justify-between gap-3 border-t border-gray-100 bg-white">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#0a0a0a] truncate">{uploadedImage.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                    {uploadedImage.sizeBytes > 0 ? formatFileSize(uploadedImage.sizeBytes) : 'Calibrated Input'}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    id="change-file-btn"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      handleRemove();
                      setTimeout(() => inputRef.current?.click(), 100);
                    }}
                  >
                    Change
                  </Button>
                  <Button
                    id="start-analysis-btn"
                    variant="primary"
                    size="sm"
                    onClick={handleStartAnalysis}
                    loading={isStarting}
                  >
                    Start Analysis
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-600" />
              <div className="space-y-1">
                <p className="font-semibold text-red-800 text-xs">Coordinate Calibration Error</p>
                <p className="text-red-700 leading-relaxed text-[11px]">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleFileInput}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
