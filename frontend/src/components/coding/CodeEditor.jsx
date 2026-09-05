import Editor from "@monaco-editor/react";

export default function CodeEditor({
  language,
  code,
  setCode,
  readOnly = false,
}) {
  return (
    <Editor
      height="100%"
      language={language}
      theme="vs-dark"
      value={code}
      onChange={(value) => {
        if (!readOnly) {
          setCode(value ?? "");
        }
      }}
      options={{
        minimap: {
          enabled: false,
        },
        readOnly,
        fontSize: 15,
        fontLigatures: true,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
      }}
    />
  );
}
