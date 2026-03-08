"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export default function MarkdownRenderer({
    content,
    className = "",
}: MarkdownRendererProps) {
    return (
        <div className={`markdown-body ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    h1: ({ children }) => (
                        <h1 className="text-lg font-semibold text-white mb-3 mt-1">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-base font-semibold text-white mb-2 mt-3">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-sm font-semibold text-white mb-1.5 mt-2">
                            {children}
                        </h3>
                    ),
                    p: ({ children }) => (
                        <p className="text-sm text-brand-text leading-relaxed mb-2">
                            {children}
                        </p>
                    ),
                    ul: ({ children }) => (
                        <ul className="ml-4 space-y-1 text-sm text-brand-text list-disc mb-2">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="ml-4 space-y-1 text-sm text-brand-text list-decimal mb-2">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="text-sm text-brand-text leading-relaxed">
                            {children}
                        </li>
                    ),
                    strong: ({ children }) => (
                        <strong className="text-white font-semibold">{children}</strong>
                    ),
                    em: ({ children }) => (
                        <em className="text-brand-text italic">{children}</em>
                    ),
                    a: ({ children, href }) => (
                        <a
                            href={href}
                            className="text-brand-link hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </a>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-brand-primary pl-4 my-2 text-brand-muted italic">
                            {children}
                        </blockquote>
                    ),
                    code: ({ className: codeClassName, children, ...props }) => {
                        const isBlock = codeClassName?.includes("language-");
                        if (isBlock) {
                            return (
                                <code className={codeClassName} {...props}>
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <code className="bg-brand-card px-1.5 py-0.5 rounded text-brand-link font-mono text-[13px]">
                                {children}
                            </code>
                        );
                    },
                    pre: ({ children }) => (
                        <pre className="bg-[#161B22] rounded-lg p-4 overflow-x-auto my-3 border border-brand-border text-[13px] leading-relaxed">
                            {children}
                        </pre>
                    ),
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-3">
                            <table className="w-full text-sm border-collapse">{children}</table>
                        </div>
                    ),
                    th: ({ children }) => (
                        <th className="text-left text-white font-semibold px-3 py-2 border-b border-brand-border bg-brand-card/50">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="text-brand-text px-3 py-2 border-b border-brand-border/50">
                            {children}
                        </td>
                    ),
                    hr: () => <hr className="border-brand-border my-4" />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
