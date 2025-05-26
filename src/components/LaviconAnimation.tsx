import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export type TriggerMode = "hover" | "click" | "auto";

export interface LaviconAnimationProps {
  url: string; // URL of the spritesheet (from the public folder)
  size?: number; // Size of the displayed icon (square)
  frameSize?: number; // Size of each frame in the spritesheet
  fps?: number; // Frames per second for the animation
  cols?: number; // Number of columns in the spritesheet
  totalFrames?: number; // Total number of frames in the spritesheet
  triggerMode?: TriggerMode; // Trigger mode for the animation
  loop?: boolean; // Loop the animation in auto or click mode
  initialFrame?: number; // Initial frame (default 0)
  className?: string; // Additional CSS classes
  alt?: string; // Alt text for accessibility
  onClick?: () => void; // Additional onClick callback
  autoPlay?: boolean; // Start the animation automatically
  renderingQuality?: "auto" | "crisp-edges" | "pixelated"; // Rendering quality
  cursorPointer?: boolean; // Enable/disable cursor pointer
}

export const LaviconAnimation: React.FC<LaviconAnimationProps> = ({
  url,
  size = 96,
  frameSize = 196,
  fps = 30,
  cols = 10,
  totalFrames = 150,
  triggerMode = "hover",
  loop = false,
  initialFrame = 0,
  className = "",
  alt = "Animation sprite",
  onClick,
  autoPlay = false,
  renderingQuality = "crisp-edges",
  cursorPointer = false,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentFrame, setCurrentFrame] = useState(initialFrame);
  const [isPressed, setIsPressed] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  
  const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('firefox');
  
  const frameInterval = 1000 / Math.min(fps, isFirefox ? 60 : 120);
  
  const direction = useRef<"forward" | "backward">("forward");
  const animationLocked = useRef<boolean>(false);

  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const scaleSpring = useSpring(scale, { stiffness: 700, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 500, damping: 25 });

  const sizeRatio = size / frameSize;

  const calculatePosition = (frame: number) => {
    const col = frame % cols;
    const row = Math.floor(frame / cols);

    return {
      transform: `translate(-${col * 100}%, -${row * 100}%)`,
      width: `${cols * 100}%`,
      height: `${Math.ceil(totalFrames / cols) * 100}%`,
      objectPosition: `${col * 100}% ${row * 100}%`,
    };
  };

  const stopAnimation = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const resetAnimation = () => {
    stopAnimation();
    setCurrentFrame(initialFrame);
    direction.current = "forward";
    animationLocked.current = false;
  };

  const animateSprite = (timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
      lastFrameTimeRef.current = timestamp;
    }

    const elapsed = timestamp - lastFrameTimeRef.current;

    if (elapsed >= frameInterval) {
      const framesAdvance = isFirefox ? 1 : Math.min(Math.floor(elapsed / frameInterval), 3);
      lastFrameTimeRef.current = timestamp - (elapsed % frameInterval);

      setCurrentFrame((prevFrame) => {
        let newFrame = prevFrame;

        if (direction.current === "forward") {
          newFrame = Math.min(prevFrame + framesAdvance, totalFrames - 1);

          if (newFrame >= totalFrames - 1) {
            if (loop) {
              direction.current = "backward";
            } else if (triggerMode === "click") {
              direction.current = "backward";
            }
          }
        } else {
          newFrame = Math.max(prevFrame - framesAdvance, initialFrame);

          if (newFrame <= initialFrame) {
            if (loop) {
              direction.current = "forward";
            } else if (triggerMode === "click") {
              animationLocked.current = false;
              setIsPlaying(false);
            }
          }
        }

        return newFrame;
      });
    }

    if (
      isPlaying ||
      (triggerMode === "hover" && isHovering) ||
      (direction.current === "backward" && currentFrame > initialFrame)
    ) {
      animationRef.current = requestAnimationFrame(animateSprite);
    } else {
      stopAnimation();
    }
  };

  // Click gestion
  const handleClick = () => {
    if (onClick) onClick();

    if (triggerMode === "click" && !animationLocked.current) {
      direction.current = "forward";
      setIsPlaying(true);
      animationLocked.current = true;

      if (!animationRef.current) {
        lastTimeRef.current = null;
        lastFrameTimeRef.current = 0;
        animationRef.current = requestAnimationFrame(animateSprite);
      }
    }
  };

  useEffect(() => {
    // Auto-play or hover/click mode
    if (
      (autoPlay && !animationRef.current) ||
      (triggerMode === "hover" && isHovering && !animationRef.current) ||
      (isPlaying && !animationRef.current)
    ) {
      // Start animation
      direction.current = "forward";
      lastTimeRef.current = null;
      lastFrameTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animateSprite);
    }
    // Stop hover and reverse animation
    else if (
      triggerMode === "hover" &&
      !isHovering &&
      currentFrame > initialFrame &&
      !animationRef.current
    ) {
      direction.current = "backward";
      lastTimeRef.current = null;
      lastFrameTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animateSprite);
    }

    return () => {
      stopAnimation();
    };
  }, [isHovering, isPlaying, autoPlay]);

  // Button onclick effect
  useEffect(() => {
    if (isPressed) {
      scale.set(0.95);
      y.set(2);
    } else {
      scale.set(1);
      y.set(0);
    }
  }, [isPressed, scale, y]);

  return (
    <motion.div
      className={`relative inline-block overflow-hidden ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        y: ySpring,
        scale: scaleSpring,
        cursor:
          cursorPointer || triggerMode === "click" ? "pointer" : "default",
        ...(isFirefox && {
          willChange: "transform",
          backfaceVisibility: "hidden",
          perspective: 1000,
        }),
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleClick}
      initial={{ opacity: 0.9 }}
      whileHover={{
        opacity: 1,
        scale: triggerMode === "click" ? 1.02 : 1.05,
        transition: { duration: 0.2 },
      }}
      role="img"
      aria-label={alt}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${size}px`,
          height: `${size}px`,
          overflow: "hidden",
          ...(isFirefox && {
            transform: "translateZ(0)",
            willChange: "background-position",
          }),
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${frameSize}px`,
            height: `${frameSize}px`,
            backgroundImage: `url(${url})`,
            backgroundSize: `${cols * frameSize}px auto`,
            backgroundPosition: `-${(currentFrame % cols) * frameSize}px -${
              Math.floor(currentFrame / cols) * frameSize
            }px`,
            backgroundRepeat: "no-repeat",
            transformOrigin: "top left",
            imageRendering:
              renderingQuality === "crisp-edges"
                ? (isFirefox ? "crisp-edges" : "pixelated")
                : renderingQuality,
            transform: `scale(${sizeRatio})`,
            ...(isFirefox && {
              backfaceVisibility: "hidden",
              willChange: "transform, background-position",
            }),
          }}
        />
      </div>
    </motion.div>
  );
};

export default LaviconAnimation;