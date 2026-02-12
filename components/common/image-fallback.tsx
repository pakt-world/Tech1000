import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
	imageUrl: string;
	fallbackImage: string;
}

const ImageWithFallback = ({
	imageUrl,
	fallbackImage,
	alt = "image",
	onClick,
	...props
}: ImageWithFallbackProps) => {
	const [imageSrc, setImageSrc] = useState<string>(imageUrl);

	const handleError = () => {
		setImageSrc(fallbackImage);
	};

	return (
		<Image
			alt={alt}
			src={imageSrc}
			onError={handleError}
			onClick={onClick}
			{...props}
		/>
	);
};

export default ImageWithFallback;
