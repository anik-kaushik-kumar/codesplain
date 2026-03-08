export const SUPPORTED_LANGUAGES = [
    { id: "javascript", label: "JavaScript", monacoId: "javascript" },
    { id: "python", label: "Python", monacoId: "python" },
    { id: "typescript", label: "TypeScript", monacoId: "typescript" },
    { id: "java", label: "Java", monacoId: "java" },
    { id: "cpp", label: "C++", monacoId: "cpp" },
    { id: "html", label: "HTML/CSS", monacoId: "html" },
] as const;

export type LanguageId = (typeof SUPPORTED_LANGUAGES)[number]["id"];

export type Difficulty = "beginner" | "intermediate" | "advanced";

export const DIFFICULTIES: { id: Difficulty; label: string }[] = [
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
];
