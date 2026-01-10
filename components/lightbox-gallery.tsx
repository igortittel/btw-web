"use client"

import type React from "react"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface LightboxGalleryProps {
  images: string[]
  alt: string
  thumbnailClassName?: string
}

export function LightboxGallery({ images, alt, thumbnailClassName = "" }: LightboxGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setIsOpen(false)
    // Restore body scroll
    document.body.style.overflow = "unset"
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox()
    if (e.key === "ArrowRight") nextImage()
    if (e.key === "ArrowLeft") prevImage()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLightbox()
    }
  }

  return (
    <>
      {/* Thumbnail Gallery */}
      <div className="flex gap-2 w-full">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className={`rounded-lg overflow-hidden flex-1 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#B88746] ${thumbnailClassName}`}
            aria-label={`Otvoriť galériu - obrázok ${index + 1}`}
          >
            <Image
              src={img || "/placeholder.svg"}
              alt={`${alt} - interiér ${index + 1}`}
              width={160}
              height={120}
              className="rounded-lg object-cover w-full h-full"
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Galéria obrázkov"
        >
          {/* Close Button */}
          <Button
            onClick={closeLightbox}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white border-0 rounded-full"
            aria-label="Zavrieť galériu"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                onClick={prevImage}
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white border-0 rounded-full"
                aria-label="Predchádzajúci obrázok"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                onClick={nextImage}
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white border-0 rounded-full"
                aria-label="Nasledujúci obrázok"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          {/* Main Image */}
          <div className="relative max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center">
            <Image
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`${alt} - interiér ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain rounded-lg"
              priority
            />
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? "border-[#B88746] opacity-100"
                      : "border-transparent opacity-60 hover:opacity-80"
                  }`}
                  aria-label={`Prejsť na obrázok ${index + 1}`}
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`${alt} - náhľad ${index + 1}`}
                    width={64}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
