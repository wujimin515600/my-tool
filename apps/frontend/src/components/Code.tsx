import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodePage: React.FC = () => {
    const [isCopied, setIsCopied] = useState(false);
    const jsCode = `function greet(name) {
        return 'Hello, ' + name + '!';
        }

        console.log(greet('World'));`;
    const handleCopy = () => {
        navigator.clipboard.writeText(jsCode).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div className="relative">
            <button
                className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition-colors"
                onClick={handleCopy}
            >
                {isCopied ? '已复制' : '复制代码'}
            </button>
            {/* <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{jsCode}</code>
            </pre> */}
            <SyntaxHighlighter language="javascript" style={atomDark}>
                {jsCode}
            </SyntaxHighlighter>
        </div>
    );
}

export default CodePage;