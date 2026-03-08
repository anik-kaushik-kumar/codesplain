"use client";

interface SkeletonLoaderProps {
    lines?: number;
}

const LINE_WIDTHS = [100, 92, 78, 85, 65, 95, 72, 88];

export default function SkeletonLoader({ lines = 3 }: SkeletonLoaderProps) {
    return (
        <div className="space-y-2.5 py-1">
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="h-3 rounded"
                    style={{
                        width: `${LINE_WIDTHS[i % LINE_WIDTHS.length]}%`,
                        background:
                            "linear-gradient(90deg, rgba(48,54,61,0.3) 25%, rgba(48,54,61,0.5) 50%, rgba(48,54,61,0.3) 75%)",
                        backgroundSize: "200% 100%",
                        animation: `shimmer 1.5s ease-in-out infinite`,
                        animationDelay: `${i * 0.1}s`,
                    }}
                />
            ))}
        </div>
    );
}
