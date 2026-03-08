import type { editor } from "monaco-editor";

export const codesplainTheme: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "8B949E", fontStyle: "italic" },
    { token: "keyword", foreground: "FF7B72" },
    { token: "string", foreground: "A5D6FF" },
    { token: "number", foreground: "79C0FF" },
    { token: "type", foreground: "FFA657" },
    { token: "function", foreground: "D2A8FF" },
    { token: "variable", foreground: "FFA657" },
    { token: "constant", foreground: "79C0FF" },
    { token: "operator", foreground: "FF7B72" },
    { token: "delimiter", foreground: "C9D1D9" },
    { token: "tag", foreground: "7EE787" },
    { token: "attribute.name", foreground: "79C0FF" },
    { token: "attribute.value", foreground: "A5D6FF" },
  ],
  colors: {
    "editor.background": "#0D1117",
    "editor.foreground": "#C9D1D9",
    "editor.lineHighlightBackground": "#161B2266",
    "editor.selectionBackground": "#2F81F740",
    "editor.inactiveSelectionBackground": "#2F81F720",
    "editorLineNumber.foreground": "#484F58",
    "editorLineNumber.activeForeground": "#C9D1D9",
    "editorCursor.foreground": "#58A6FF",
    "editorIndentGuide.background": "#21262D",
    "editorIndentGuide.activeBackground": "#30363D",
    "editor.selectionHighlightBackground": "#2F81F715",
    "editorBracketMatch.background": "#2F81F730",
    "editorBracketMatch.border": "#2F81F750",
    "scrollbarSlider.background": "#30363D80",
    "scrollbarSlider.hoverBackground": "#484F58",
    "scrollbarSlider.activeBackground": "#8B949E",
    "editorWidget.background": "#161B22",
    "editorWidget.border": "#30363D",
    "editorSuggestWidget.background": "#161B22",
    "editorSuggestWidget.border": "#30363D",
    "editorSuggestWidget.selectedBackground": "#30363D",
  },
};

export const DEFAULT_CODE = `async function fetchUserData(userId: string) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) {
      throw new Error('User not found');
    }

    const data = await response.json();
    // Transform the raw data to match our UI state
    return {
      id: data.uuid,
      name: \`\${data.firstName} \${data.lastName}\`,
      email: data.contactEmail,
      isPremium: data.subscriptionStatus === 'PRO'
    };
  } catch (err) {
    console.error('Failed to fetch user:', err);
    return null;
  }
}`;
