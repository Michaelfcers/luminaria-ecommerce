"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { ActionIcon, Image, Box, Grid, AspectRatio } from "@mantine/core"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Box>
      {/* Main Image */}
      <Box pos="relative" mb="md">
        <AspectRatio ratio={1} bg="gray.1" style={{ borderRadius: 'var(--mantine-radius-md)', overflow: 'hidden' }}>
          <Image
            src={images[currentImage] || "/placeholder.svg"}
            alt={`${productName} - Imagen ${currentImage + 1}`}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              transform: isZoomed ? "scale(1.5)" : "scale(1)",
              transition: "transform 0.5s ease",
              cursor: isZoomed ? "zoom-out" : "zoom-in"
            }}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        </AspectRatio>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <ActionIcon
              variant="default"
              size="lg"
              pos="absolute"
              left={10}
              top="50%"
              style={{ transform: 'translateY(-50%)', opacity: 0.8 }}
              onClick={prevImage}
            >
              <ChevronLeft size={18} />
            </ActionIcon>
            <ActionIcon
              variant="default"
              size="lg"
              pos="absolute"
              right={10}
              top="50%"
              style={{ transform: 'translateY(-50%)', opacity: 0.8 }}
              onClick={nextImage}
            >
              <ChevronRight size={18} />
            </ActionIcon>
          </>
        )}

        {/* Zoom Icon */}
        <ActionIcon
          variant="light"
          size="md"
          pos="absolute"
          top={10}
          right={10}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <ZoomIn size={16} />
        </ActionIcon>
      </Box>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <Grid gutter="xs">
          {images.map((image, index) => (
            <Grid.Col span={3} key={index}>
              <Box
                component="button"
                onClick={() => setCurrentImage(index)}
                style={{
                  width: '100%',
                  border: currentImage === index ? '2px solid var(--mantine-color-blue-6)' : '2px solid transparent',
                  borderRadius: 'var(--mantine-radius-md)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <AspectRatio ratio={1}>
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${productName} - Miniatura ${index + 1}`}
                    fit="cover"
                  />
                </AspectRatio>
              </Box>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Box>
  )
}
