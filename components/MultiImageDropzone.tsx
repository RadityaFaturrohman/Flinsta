'use client';

import { cn } from '@/utils/utils';
import { formatFileSize } from '@edgestore/react/utils';
import { ChevronLeft, ChevronRight, UploadCloudIcon, X } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { useEffect } from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';
import useEmblaCarousel from 'embla-carousel-react'
import { dummyPins } from '@/dummy/dummyData';

const variants = {
  base: 'relative rounded-md aspect-square flex justify-center items-center flex-col cursor-pointer min-h-[150px] min-w-[200px] border border-dashed border-black border-opacity-20 transition-colors duration-200 ease-in-out rounded-xl overflow-hidden',
  image:
    'border-0 p-0 w-full relative shadow-md bg-slate-200 dark:bg-slate-900 rounded-md',
  active: 'border-2',
  disabled:
    'bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700',
  accept: 'border border-blue-500 bg-blue-500 bg-opacity-10',
  reject: 'border border-red-700 bg-red-700 bg-opacity-10',
};

export type FileState = {
  file: File | string;
  key: string; // used to identify the file in the progress callback
  progress: 'PENDING' | 'COMPLETE' | 'ERROR' | number;
};

type InputProps = {
  className?: string;
  value?: FileState[];
  onChange?: (files: FileState[]) => void | Promise<void>;
  onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, 'disabled'>;
  width?: number,
  height?: number
};

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
  },
  fileInvalidType() {
    return 'Invalid file type.';
  },
  tooManyFiles(maxFiles: number) {
    return `You can only add ${maxFiles} file(s).`;
  },
  fileNotSupported() {
    return 'The file is not supported.';
  },
};

const MultiImageDropzone = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { dropzoneOptions, value, className, disabled, onChange, onFilesAdded, width, height },
    ref,
  ) => {
    const [customError, setCustomError] = React.useState<string>();

    const imageUrls = React.useMemo(() => {
      if (value) {
        return value.map((fileState) => {
          if (typeof fileState.file === 'string') {
            // in case a url is passed in, use it to display the image
            return fileState.file;
          } else {
            // in case a file is passed in, create a base64 url to display the image
            return URL.createObjectURL(fileState.file);
          }
        });
      }
      return [];
    }, [value]);

    // dropzone configuration
    const {
      getRootProps,
      getInputProps,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      accept: { 'image/*': [] },
      disabled,
      onDrop: (acceptedFiles) => {
        const files = acceptedFiles;
        setCustomError(undefined);
        if (
          dropzoneOptions?.maxFiles &&
          (value?.length ?? 0) + files.length > dropzoneOptions.maxFiles
        ) {
          setCustomError(ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles));
          return;
        }
        if (files) {
          const addedFiles = files.map<FileState>((file) => ({
            file,
            key: Math.random().toString(36).slice(2),
            progress: 'PENDING',
          }));
          void onFilesAdded?.(addedFiles);
          void onChange?.([...(value ?? []), ...addedFiles]);
        }
      },
      ...dropzoneOptions,
    });

    // styling
    const dropZoneClassName = React.useMemo(
      () =>
        twMerge(
          variants.base,
          isFocused && variants.active,
          disabled && variants.disabled,
          (isDragReject ?? fileRejections[0]) && variants.reject,
          isDragAccept && variants.accept,
          className,
        ).trim(),
      [
        isFocused,
        fileRejections,
        isDragAccept,
        isDragReject,
        disabled,
        className,
      ],
    );

    // error validation messages
    const errorMessage = React.useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0];
        if (errors[0]?.code === 'file-too-large') {
          return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
        } else if (errors[0]?.code === 'file-invalid-type') {
          return ERROR_MESSAGES.fileInvalidType();
        } else if (errors[0]?.code === 'too-many-files') {
          return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
        } else {
          return ERROR_MESSAGES.fileNotSupported();
        }
      }
      return undefined;
    }, [fileRejections, dropzoneOptions]);

    return (
      <div>
        <div className="">
          {/* Images */}
          {/* {value?.map(({ file, progress }, index) => (
            <div
              key={index}
              className={variants.image}
              style={{
                width,
                height
              }}
            >
              <Image
                className="h-auto w-full rounded-md object-cover"
                src={imageUrls[index]}
                width={0}
                height={0}
                sizes='100vw'
                alt={typeof file === 'string' ? file : file.name}
              />

              {typeof progress === 'number' && (
                <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-md bg-black bg-opacity-70">
                  <CircleProgress progress={progress} />
                </div>
              )}

              {imageUrls[index] && !disabled && progress === 'PENDING' && (
                <div
                  className="group absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    void onChange?.(value.filter((_, i) => i !== index) ?? []);
                  }}
                >
                  <div className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border border-solid border-gray-500 bg-white transition-all duration-300 hover:h-6 hover:w-6 dark:border-gray-400 dark:bg-black">
                    <X
                      className="text-gray-500 dark:text-gray-400"
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
              )}
            </div>
          ))} */}
          {/* {value && value.length > 0 && (
            <ImageList
              width={width!}
              height={height!}
              images={value.map((fileState) =>
                typeof fileState.file === 'string' ? fileState.file : URL.createObjectURL(fileState.file)
              )}
            />
          )} */}

          {/* Dropzone */}
          {(!value || value.length === 0 ? (
            <div
              {...getRootProps({
                className: dropZoneClassName,
                style: {
                  width,
                  height
                }
              })}
            >
              <>
                <input ref={ref} {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-xs text-gray-400">
                  <UploadCloudIcon className="mb-2 h-10 w-10 text-black" />
                  <div className="text-black font-medium text-sm">JPEG / GIF / PNG</div>
                  <div className="text-black font-normal mt-2 w-8/12 text-center">You can upload to 20 MB on each file and a maximum of 6 files</div>
                  <div className="mt-3">
                    <Button className='text-blue-500'>Select a file</Button>
                  </div>
                </div>
              </>
            </div>
          ) : (
            <ImageList
              width={width!}
              height={height!}
              images={value.map((fileState) =>
                typeof fileState.file === 'string' ? fileState.file : URL.createObjectURL(fileState.file)
              )}
            />
          ))}
        </div>
        {/* Error Text */}
        <div className="mt-1 text-xs text-red-500">
          {customError ?? errorMessage}
        </div>
      </div>
    );
  },
);
MultiImageDropzone.displayName = 'MultiImageDropzone';

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      className={twMerge(
        // base
        'focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50',
        // color
        'border shadow hover:text-gray-500 border-gray-600 hover:bg-gray-700 text-blue-500',
        // size
        'h-6 rounded-md px-2 text-xs',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export { MultiImageDropzone };

function CircleProgress({ progress }: { progress: number }) {
  const strokeWidth = 10;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative h-16 w-16">
      <svg
        className="absolute top-0 left-0 -rotate-90 transform"
        width="100%"
        height="100%"
        viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2
          }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="text-gray-400"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
        />
        <circle
          className="text-white transition-all duration-300 ease-in-out"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={((100 - progress) / 100) * circumference}
          strokeLinecap="round"
          fill="none"
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
        />
      </svg>
      <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center text-xs text-white">
        {Math.round(progress)}%
      </div>
    </div>
  );
}

interface ImageList {
  width: number;
  height: number;
  images: string[];
}

interface ImageListProps {
  images: string[];
}

const ImageList: React.FC<ImageList> = ({ images, width, height }) => {
  const [viewportRef, embla] = useEmblaCarousel({
    loop: false, // set to true if you want the carousel to loop
  });
  const prevButtonRef = React.useRef<HTMLButtonElement>(null);
  const nextButtonRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!embla) return;

    const onSelect = () => {
      // Add custom logic here if needed
    };

    embla.on('select', onSelect);
    return () => embla.off('select', onSelect);
  }, [embla]);

  return (
    <div className={cn('embla', 'relative')}>
      <div className={cn('embla__viewport')} ref={viewportRef}>
        <div className={cn('embla__container',)} style={{ width, height }}>
          {images.map((imageUrl, index) => (
            <div className={cn('embla__slide')} key={index}>
              <Image src={imageUrl} alt={`Slide ${index}`} width={500} height={500} className='rounded' />
            </div>
          ))}
        </div>
      </div>
      <button
        ref={prevButtonRef}
        className={cn('embla__button', 'embla__button--prev')}
        onClick={() => embla && embla.scrollPrev()}
      >
        <ChevronLeft strokeWidth={3} className='size-5 text-dark' />
      </button>
      <button
        ref={nextButtonRef}
        className={cn('embla__button', 'embla__button--next')}
        onClick={() => embla && embla.scrollNext()}
      >
        <ChevronRight strokeWidth={3} className='size-5 text-dark' />
      </button>
    </div>
  );
};