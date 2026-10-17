"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export default function PropertyGallery({ images = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

    const triggerNext = useCallback(() => {
        setFade(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
            setFade(true);
        }, 150);
    }, [images.length]);

    const triggerPrev = useCallback(() => {
        setFade(false);
        setTimeout(() => {
            setCurrentIndex((prev) =>
                prev === 0 ? images.length - 1 : prev - 1
            );
            setFade(true);
        }, 150);
    }, [images.length]);

    const openModal = (i) => {
        setModalIndex(i);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const modalNext = () =>
        setModalIndex((prev) => (prev + 1) % images.length);

    const modalPrev = () =>
        setModalIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    // Touch swipe for mobile
    const startXRef = useRef(0);

    const onTouchStart = (e) => {
        startXRef.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e) => {
        const endX = e.changedTouches[0].clientX;
        if (startXRef.current - endX > 50) triggerNext();
        if (endX - startXRef.current > 50) triggerPrev();
    };

    if (!images || images.length === 0) return null;

    return (
        <div className="w-full flex flex-col md:flex-row gap-4">
            {/* THUMBNAILS (DESKTOP) */}
            {images.length > 1 && (
                <div className="hidden md:flex flex-col gap-3 w-28 overflow-y-auto max-h-[460px] pr-1 scrollbar-thin">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentIndex(index)}
                            className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all shrink-0 h-24 w-full
                                ${currentIndex === index ? "border-[#1E7F4B] ring-2 ring-[#1E7F4B]/30 shadow-md" : "border-transparent opacity-75 hover:opacity-100"}`}
                        >
                            <Image
                                src={img}
                                fill
                                alt={`Thumbnail ${index + 1}`}
                                className="object-cover"
                                sizes="112px"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* MAIN IMAGE CONTAINER */}
            <div
                className="relative w-full h-[320px] sm:h-[400px] md:h-[460px] rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100 group select-none"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                <div
                    className={`relative w-full h-full transition-opacity duration-200 cursor-pointer ${fade ? "opacity-100" : "opacity-40"}`}
                    onClick={() => openModal(currentIndex)}
                >
                    <Image
                        src={images[currentIndex]}
                        alt={`Property image ${currentIndex + 1}`}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 800px"
                    />
                </div>

                {/* PHOTO COUNTER PILL */}
                <div className="absolute top-4 right-4 bg-black/65 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none">
                    <Maximize2 size={12} />
                    <span>{currentIndex + 1} / {images.length}</span>
                </div>

                {/* PREV / NEXT ARROWS */}
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            aria-label="Previous photo"
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#0B1F33] p-2.5 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none"
                            onClick={(e) => {
                                e.stopPropagation();
                                triggerPrev();
                            }}
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <button
                            type="button"
                            aria-label="Next photo"
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#0B1F33] p-2.5 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none"
                            onClick={(e) => {
                                e.stopPropagation();
                                triggerNext();
                            }}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}

                {/* MOBILE THUMB DOTS */}
                {images.length > 1 && (
                    <div className="md:hidden absolute bottom-3 inset-x-0 flex justify-center gap-1.5 pointer-events-none">
                        {images.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all ${currentIndex === i ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* FULLSCREEN LIGHTBOX MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/95 z-[999] flex flex-col items-center justify-between p-4 md:p-6 backdrop-blur-md">
                    {/* TOP BAR */}
                    <div className="w-full flex items-center justify-between text-white max-w-6xl pt-2">
                        <span className="text-sm font-medium tracking-wide">
                            Photo {modalIndex + 1} of {images.length}
                        </span>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
                            aria-label="Close fullscreen"
                        >
                            <X size={28} />
                        </button>
                    </div>

                    {/* MAIN LIGHTBOX IMAGE */}
                    <div className="relative w-full max-w-5xl h-[65vh] md:h-[75vh] flex items-center justify-center">
                        <div className="relative w-full h-full">
                            <Image
                                src={images[modalIndex]}
                                alt={`Fullscreen property image ${modalIndex + 1}`}
                                fill
                                className="object-contain"
                                sizes="1200px"
                            />
                        </div>

                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition"
                                    onClick={modalPrev}
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft size={28} />
                                </button>
                                <button
                                    type="button"
                                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition"
                                    onClick={modalNext}
                                    aria-label="Next image"
                                >
                                    <ChevronRight size={28} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* BOTTOM THUMBNAILS STRIP */}
                    {images.length > 1 && (
                        <div className="flex gap-2.5 overflow-x-auto py-2 w-full max-w-4xl justify-center">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setModalIndex(i)}
                                    className={`relative cursor-pointer rounded-lg overflow-hidden shrink-0 w-16 h-12 md:w-20 md:h-14 border-2 transition-all
                                        ${modalIndex === i ? "border-[#1E7F4B] scale-105" : "border-transparent opacity-60 hover:opacity-100"}`}
                                >
                                    <Image
                                        src={img}
                                        fill
                                        alt={`Modal preview ${i + 1}`}
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
