import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import DOMPurify from 'dompurify';



const socket = io.connect('http://localhost:3001');

function App() {
    const [markdown, setMarkdown] = useState('');
    const [html, setHtml] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        socket.on('html', (data) => {
          
          console.log(data)
            if (data.error) {
                setError(data.error);
            } else {
                setHtml(data);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleMarkdownChange = (event) => {
        const content = event.target.value;
        setMarkdown(content);
        socket.emit('markdown', content);
    };

    return (
        <div className="app">
            <div className="editor">
                <textarea
                    value={markdown}
                    onChange={handleMarkdownChange}
                    placeholder="Type Markdown here..."
                ></textarea>
            </div>
            <div className="preview">
                {error ? (
                    <div className="error">{error}</div>
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: html }}></div>
                )}
            </div>
        </div>
    );
}

export default App;
