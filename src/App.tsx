import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Crop, Move, FlipHorizontal, FlipVertical } from 'lucide-react';
import ReactCrop, { Crop as CropType, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface SizeOption {
  value: string;
  label: string;
  price: number;
  width: number;
  height: number;
}

interface CategoryImage {
  id: string;
  url: string;
  title: string;
}

const categories = [
  "Buddha", "Ram", "Radha Krishna", "Shivaji", "Ganesh",
  "Sai Baba", "Mahadev", "Dr. Ambedkar"
];

// Sample category images (in production, these would come from a database)
const categoryImages: Record<string, CategoryImage[]> = {
  "Buddha": [
    { id: "b1", url: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827", title: "Buddha Statue 1" },
    { id: "b2", url: "https://images.unsplash.com/photo-1610498263193-861fbf403f46", title: "Buddha Statue 2" },
    { id: "b3", url: "https://images.unsplash.com/photo-1576723417715-6b408c988c23", title: "Buddha Statue 3" },
  ],
  "Ram": [
    { id: "r1", url: "https://images.unsplash.com/photo-1582126892906-5ba111b3c9dd", title: "Ram Temple" },
    { id: "r2", url: "https://images.unsplash.com/photo-1580742024302-9e5d0927c915", title: "Ram Temple 2" },
  ],
  "Ganesh": [
    { id: "g1", url: "https://images.unsplash.com/photo-1567591370504-c8b05bd3b30e", title: "Ganesh Statue" },
    { id: "g2", url: "https://images.unsplash.com/photo-1576487248805-cf45e9336e14", title: "Ganesh Statue 2" },
  ],
};

// Generic background images
const defaultBackgrounds = [
  { url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809", title: "Gradient 1" },
  { url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85", title: "Gradient 2" },
  { url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d", title: "Gradient 3" },
  { url: "https://images.unsplash.com/photo-1557683316-973673baf926", title: "Gradient 4" },
];

// Frame variations
const frames = [
  { id: "f1", url: "https://images.unsplash.com/photo-1516981879613-9f5da904015f", title: "Classic Wood", borderColor: "#8B4513" },
  { id: "f2", url: "https://images.unsplash.com/photo-1534447677768-be436bb09401", title: "Gold Ornate", borderColor: "#FFD700" },
  { id: "f3", url: "https://images.unsplash.com/photo-1579965342575-16428a7c8881", title: "Antique Bronze", borderColor: "#CD853F" },
  { id: "f4", url: "https://images.unsplash.com/photo-1579965342575-16428a7c8881", title: "Silver Modern", borderColor: "#C0C0C0" },
  { id: "f5", url: "https://images.unsplash.com/photo-1579965342575-16428a7c8881", title: "Black Matte", borderColor: "#2C2C2C" },
];

// Size options as requested - reshuffled
const landscapeSizes = [
  { value: '30x20', label: '76.2 × 50.8 cm (30" × 20")', price: 59.99, width: 550, height: 367 },
  { value: '24x16', label: '61.0 × 40.6 cm (24" × 16")', price: 49.99, width: 500, height: 333 },
  { value: '18x12', label: '45.7 × 30.5 cm (18" × 12")', price: 39.99, width: 450, height: 300 },
  { value: '12x8', label: '30.5 × 20.3 cm (12" × 8")', price: 29.99, width: 400, height: 267 }
];

const portraitSizes = [
  { value: '20x30', label: '50.8 × 76.2 cm (20" × 30")', price: 59.99, width: 367, height: 550 },
  { value: '16x24', label: '40.6 × 61.0 cm (16" × 24")', price: 49.99, width: 333, height: 500 },
  { value: '12x18', label: '30.5 × 45.7 cm (12" × 18")', price: 39.99, width: 300, height: 450 },
  { value: '8x12', label: '20.3 × 30.5 cm (8" × 12")', price: 29.99, width: 267, height: 400 }
];

const squareSizes = [
  { value: '12x12', label: '30.5 × 30.5 cm (12" × 12")', price: 39.99, width: 450, height: 450 },
  { value: '10x10', label: '25.4 × 25.4 cm (10" × 10")', price: 34.99, width: 400, height: 400 },
  { value: '8x8', label: '20.3 × 20.3 cm (8" × 8")', price: 29.99, width: 350, height: 350 },
  { value: '6x6', label: '15.2 × 15.2 cm (6" × 6")', price: 24.99, width: 300, height: 300 }
];

const sizeOptions = {
  landscape: landscapeSizes,
  portrait: portraitSizes,
  square: squareSizes
};

function CategoryPage({ 
  category, 
  images, 
  onClose,
  onSelectImage,
  selectedSize
}: { 
  category: string; 
  images: CategoryImage[]; 
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  selectedSize: string;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[80vw] h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{category} Images</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                <h3 className="text-white text-lg font-semibold">{img.title}</h3>
                <button
                  onClick={() => onSelectImage(img.url)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add to Frame
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<"landscape" | "portrait" | "square">("landscape");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [backgroundImages, setBackgroundImages] = useState<string[]>(defaultBackgrounds.map(bg => bg.url));
  const [showCrop, setShowCrop] = useState(false);
  const [showCategoryPage, setShowCategoryPage] = useState(false);
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<CropType>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [isExternalImage, setIsExternalImage] = useState(false);

  // Update crop when size changes
  useEffect(() => {
    if (selectedSize && imgRef.current) {
      const currentSize = getCurrentSizeOption();
      if (currentSize) {
        const { width, height } = currentSize;
        const aspect = width / height;
        
        // Create a centered crop with the correct aspect ratio
        const newCrop = centerCrop(
          makeAspectCrop(
            {
              unit: '%',
              width: 90,
            },
            aspect,
            imgRef.current.width,
            imgRef.current.height
          ),
          imgRef.current.width,
          imgRef.current.height
        );
        
        setCrop(newCrop);
      }
    }
  }, [selectedSize, mainImage]);

  // Reset crop settings when opening crop dialog
  useEffect(() => {
    if (showCrop) {
      // Reset to original image if available
      if (originalImage) {
        setMainImage(originalImage);
      }
      
      // Reset all transformation values
      setScale(1);
      setRotate(0);
      setFlipHorizontal(false);
      setFlipVertical(false);
      setPosition({ x: 0, y: 0 });
      
      // Reset crop if we have a size selected
      if (selectedSize && imgRef.current) {
        const currentSize = getCurrentSizeOption();
        if (currentSize) {
          const { width, height } = currentSize;
          const aspect = width / height;
          
          // Create a centered crop with the correct aspect ratio
          const newCrop = centerCrop(
            makeAspectCrop(
              {
                unit: '%',
                width: 90,
              },
              aspect,
              imgRef.current.width,
              imgRef.current.height
            ),
            imgRef.current.width,
            imgRef.current.height
          );
          
          setCrop(newCrop);
        }
      }
    }
  }, [showCrop, originalImage, selectedSize]);

  // Generate cropped image when crop is completed
  useEffect(() => {
    if (completedCrop && imgRef.current && previewCanvasRef.current) {
      // Skip processing for external images that would taint the canvas
      if (isExternalImage) {
        return;
      }

      const image = imgRef.current;
      const canvas = previewCanvasRef.current;
      const crop = completedCrop;

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        return;
      }
      
      // Set canvas size to match the crop size
      const pixelRatio = window.devicePixelRatio;
      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;
      
      // Scale the context to account for device pixel ratio
      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = 'high';
      
      // Calculate the position and size for drawing the image
      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;
      const cropWidth = crop.width * scaleX;
      const cropHeight = crop.height * scaleY;
      
      // Apply transformations
      ctx.save();
      
      // Center point for transformations
      const centerX = canvas.width / (2 * pixelRatio);
      const centerY = canvas.height / (2 * pixelRatio);
      
      // Translate to center, apply transformations, then translate back
      ctx.translate(centerX, centerY);
      
      // Apply rotation
      ctx.rotate((rotate * Math.PI) / 180);
      
      // Apply scale
      ctx.scale(
        scale * (flipHorizontal ? -1 : 1),
        scale * (flipVertical ? -1 : 1)
      );
      
      // Apply position offset
      ctx.translate(position.x / scale, position.y / scale);
      
      // Translate back
      ctx.translate(-centerX, -centerY);
      
      // Draw the image
      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        crop.width,
        crop.height
      );
      
      ctx.restore();
      
      try {
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCroppedImageUrl(dataUrl);
      } catch (err) {
        console.error('Canvas tainted by cross-origin data:', err);
        // For external images, we'll use the original image and visual transformations
        // instead of canvas-based transformations
        setCroppedImageUrl(mainImage);
      }
    }
  }, [completedCrop, scale, rotate, flipHorizontal, flipVertical, position, isExternalImage, mainImage]);

  const getBorderSize = () => {
    if (!selectedSize) return 10;
    
    // Get the first number from the size (e.g., "8x12" -> 8)
    const firstDimension = parseInt(selectedSize.split('x')[0]);
    const secondDimension = parseInt(selectedSize.split('x')[1]);
    
    // If either dimension is 12 or less, use 10px border
    if (firstDimension <= 12 || secondDimension <= 12) {
      return 10;
    } else {
      return 20;
    }
  };

  const handleMainImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setMainImage(imageUrl);
      setOriginalImage(imageUrl); // Store the original image
      setCroppedImageUrl(null);
      setIsExternalImage(false); // Local file uploads are not cross-origin
    }
  };

  const handleBgImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImages(prev => [...prev, imageUrl]);
    }
  };

  const handleCategoryImageSelect = (imageUrl: string) => {
    setMainImage(imageUrl);
    setOriginalImage(imageUrl); // Store the original image
    setCroppedImageUrl(null);
    setShowCategoryPage(false);
    setIsExternalImage(true); // Images from categories are external URLs
  };

  const getCurrentSizeOption = (): SizeOption | null => {
    return sizeOptions[orientation].find(size => size.value === selectedSize) || null;
  };

  const selectedFrameStyle = selectedFrame
    ? frames.find(f => f.id === selectedFrame)
    : null;

  const handleApplyCrop = () => {
    if (isExternalImage) {
      // For external images, we'll apply visual transformations in the UI
      // instead of using canvas-based transformations
      setShowCrop(false);
    } else if (croppedImageUrl) {
      setMainImage(croppedImageUrl);
      setShowCrop(false);
    }
  };

  // Calculate the display dimensions based on the selected size
  const getDisplayDimensions = () => {
    const currentSize = getCurrentSizeOption();
    if (!currentSize) return { width: 'auto', height: 'auto' };
    
    // Use the exact width and height from the size option
    return {
      width: `${currentSize.width}px`,
      height: `${currentSize.height}px`
    };
  };

  // Handle mouse events for dragging the image
  const handleMouseDown = (e: React.MouseEvent) => {
    if (cropContainerRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && cropContainerRef.current) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (cropContainerRef.current && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && cropContainerRef.current && e.touches.length === 1) {
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Religious Art Customization
        </h1>

        {/* Categories */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Select Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setShowCategoryPage(true);
                }}
                className={`p-3 rounded-lg text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Upload Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="main-image"
                      className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload main image</span>
                      <input
                        id="main-image"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleMainImageUpload}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Background Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Image (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="bg-image"
                      className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload background</span>
                      <input
                        id="bg-image"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleBgImageUpload}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Size Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Select Size</h2>
          
          {/* Orientation Radio Buttons */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orientation
            </label>
            <div className="flex gap-4">
              {(['landscape', 'portrait', 'square'] as const).map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="orientation"
                    value={type}
                    checked={orientation === type}
                    onChange={(e) => {
                      setOrientation(e.target.value as typeof orientation);
                      setSelectedSize('');
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Print Size
            </label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select a size</option>
              {sizeOptions[orientation].map((size: SizeOption) => (
                <option key={size.value} value={size.value}>
                  {size.label} - ${size.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-12 gap-6">
          {/* Background Images Scroll Bar */}
          <div className="col-span-2 bg-white rounded-lg shadow-md p-4 max-h-[600px] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Backgrounds</h3>
            <div className="space-y-4">
              {backgroundImages.map((bgImg, index) => (
                <div
                  key={index}
                  onClick={() => setBgImage(bgImg)}
                  className={`cursor-pointer rounded-lg overflow-hidden ${
                    bgImg === bgImage ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img src={bgImg} alt={`Background ${index + 1}`} className="w-full h-24 object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Preview Section */}
          <div className="col-span-8 bg-white rounded-lg shadow-md p-4">
            <div className="relative">
              {mainImage && (
                <div className="absolute top-4 right-4 z-10 flex space-x-2">
                  <button
                    onClick={() => setShowCrop(!showCrop)}
                    className="bg-white rounded-full p-2 shadow-md"
                    title="Crop Image"
                  >
                    <Crop className="w-6 h-6" />
                  </button>
                </div>
              )}
              
              <div className="relative h-[600px] flex items-center justify-center">
                {bgImage && (
                  <img
                    src={bgImage}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                
                {showCrop && mainImage ? (
                  <div className="relative z-10 bg-white p-4 rounded-lg shadow-lg w-full max-w-3xl">
                    <h3 className="text-lg font-semibold mb-4">Crop Image</h3>
                    
                    <div 
                      className="mb-4 relative" 
                      ref={cropContainerRef}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    >
                      <div className="absolute top-2 right-2 z-10 flex space-x-2 bg-white bg-opacity-75 rounded-lg p-1">
                        <Move className="w-5 h-5 text-gray-700" />
                        <span className="text-xs font-medium">Drag to move</span>
                      </div>
                      
                      <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={
                          getCurrentSizeOption()
                            ? getCurrentSizeOption()!.width / getCurrentSizeOption()!.height
                            : undefined
                        }
                      >
                        <img
                          ref={imgRef}
                          src={mainImage}
                          alt="Crop preview"
                          crossOrigin="anonymous"
                          style={{ 
                            maxHeight: '400px',
                            transform: `
                              scale(${scale * (flipHorizontal ? -1 : 1)}, ${scale * (flipVertical ? -1 : 1)}) 
                              rotate(${rotate}deg)
                              translate(${position.x / scale}px, ${position.y / scale}px)
                            `,
                            maxWidth: '100%',
                            transformOrigin: 'center'
                          }}
                          onLoad={() => {
                            // Check if the image is from an external domain
                            if (mainImage && (
                              mainImage.startsWith('http') && 
                              !mainImage.startsWith(window.location.origin)
                            )) {
                              setIsExternalImage(true);
                            }
                          }}
                        />
                      </ReactCrop>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Scale: {scale.toFixed(1)}x
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={scale}
                          onChange={(e) => setScale(parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rotate: {rotate}°
                        </label>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          value={rotate}
                          onChange={(e) => setRotate(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between mb-4">
                      <button
                        onClick={() => setFlipHorizontal(!flipHorizontal)}
                        className={`flex items-center px-3 py-2 rounded-lg ${
                          flipHorizontal ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        } hover:bg-gray-200`}
                      >
                        <FlipHorizontal className="w-5 h-5 mr-2" />
                        Flip Horizontal
                      </button>
                      <button
                        onClick={() => setFlipVertical(!flipVertical)}
                        className={`flex items-center px-3 py-2 rounded-lg ${
                          flipVertical ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        } hover:bg-gray-200`}
                      >
                        <FlipVertical className="w-5 h-5 mr-2" />
                        Flip Vertical
                      </button>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        onClick={() => setShowCrop(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleApplyCrop}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Apply Crop
                      </button>
                    </div>
                    
                    {isExternalImage && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-700">
                          Note: This image is from an external source. Some advanced editing features may be limited.
                        </p>
                      </div>
                    )}
                    
                    {/* Hidden canvas for cropping */}
                    <canvas
                      ref={previewCanvasRef}
                      style={{
                        display: 'none',
                        width: completedCrop?.width ?? 0,
                        height: completedCrop?.height ?? 0,
                      }}
                    />
                  </div>
                ) : (
                  mainImage && (
                    <div className="relative flex items-center justify-center overflow-hidden">
                      {selectedSize ? (
                        <div
                          style={{
                            ...getDisplayDimensions(),
                            overflow: 'hidden',
                            border: selectedFrameStyle
                              ? `${getBorderSize()}px solid ${selectedFrameStyle.borderColor}`
                              : undefined,
                          }}
                          className="relative"
                        >
                          <img
                            src={mainImage}
                            alt="Main"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="text-center p-8">
                          <p className="text-gray-600 mb-4">Please select a size to see the image in proper dimensions</p>
                          <img
                            src={mainImage}
                            alt="Main"
                            className="max-w-md max-h-md object-contain mx-auto"
                          />
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Frames Scroll Bar */}
          <div className="col-span-2 bg-white rounded-lg shadow-md p-4 max-h-[600px] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Frames</h3>
            <div className="space-y-4">
              {frames.map((frame) => (
                <div
                  key={frame.id}
                  onClick={() => setSelectedFrame(frame.id)}
                  className={`cursor-pointer rounded-lg overflow-hidden ${
                    frame.id === selectedFrame ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="w-full h-24 relative">
                    <img src={frame.url} alt={frame.title} className="w-full h-full object-cover" />
                    <div
                      className="absolute inset-0"
                      style={{ border: `10px solid ${frame.borderColor}` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{frame.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Information Section */}
        {(mainImage || selectedFrame || selectedSize) && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Selected Options</h2>
            <div className="grid grid-cols-3 gap-6">
              {mainImage && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Main Image</h3>
                  <img src={mainImage} alt="Selected main" className="w-24 h-24 object-cover rounded-lg" />
                </div>
              )}
              {selectedFrame && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Frame</h3>
                  <div className="relative w-24 h-24">
                    <img
                      src={frames.find(f => f.id === selectedFrame)?.url}
                      alt="Selected frame"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div
                      className="absolute inset-0 rounded-lg"
                      style={{
                        border: `5px solid ${frames.find(f => f.id === selectedFrame)?.borderColor}`
                      }}
                    />
                  </div>
                </div>
              )}
              {selectedSize && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Size</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {sizeOptions[orientation].find(s => s.value === selectedSize)?.label}
                  </p>
                  <p className="text-sm text-gray-600">
                    Resolution: {getCurrentSizeOption()?.width} × {getCurrentSizeOption()?.height}px
                  </p>
                  <p className="text-sm font-medium text-blue-600 mt-1">
                    ${getCurrentSizeOption()?.price.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category Page Modal */}
        {showCategoryPage && selectedCategory && categoryImages[selectedCategory] && (
          <CategoryPage
            category={selectedCategory}
            images={categoryImages[selectedCategory]}
            onClose={() => setShowCategoryPage(false)}
            onSelectImage={handleCategoryImageSelect}
            selectedSize={selectedSize}
          />
        )}
      </div>
    </div>
  );
}

export default App;