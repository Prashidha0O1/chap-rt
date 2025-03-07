import React from "react";
import { cn } from "@/lib/utils";
import Image from 'next/image';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = "", fallback, size = "md", ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const handleImageError = () => {
      setImageError(true);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full overflow-hidden bg-gray-200",
          size === "sm" && "h-8 w-8",
          size === "md" && "h-10 w-10",
          size === "lg" && "h-12 w-12",
          className
        )}
        {...props}
      >
        {src && !imageError ? (
          <Image
            src={src || "/diddy.PNG"}
            alt={alt}
            layout="fill"
            objectFit="cover"
            onError={handleImageError}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-600 font-medium">
            {fallback || alt.charAt(0) || "?"}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
