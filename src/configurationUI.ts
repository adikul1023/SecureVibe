import * as vscode from 'vscode';

interface CustomPattern {
    pattern: string;
    description: string;
    severity: 'error' | 'warning' | 'info';
    languages: string[];
}

export class ConfigurationUI {
    private static instance: ConfigurationUI;
    private panel: vscode.WebviewPanel | undefined;

    private constructor() {}

    public static getInstance(): ConfigurationUI {
        if (!ConfigurationUI.instance) {
            ConfigurationUI.instance = new ConfigurationUI();
        }
        return ConfigurationUI.instance;
    }

    public showConfigurationUI() {
        if (this.panel) {
            this.panel.reveal();
            return;
        }

        this.panel = vscode.window.createWebviewPanel(
            'securevibeConfig',
            'SecureVibe Configuration',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        this.panel.webview.html = this.getWebviewContent();

        this.panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'savePattern':
                        this.saveCustomPattern(message.pattern as CustomPattern);
                        break;
                    case 'deletePattern':
                        this.deleteCustomPattern(message.patternId as number);
                        break;
                }
            },
            undefined,
            []
        );

        this.panel.onDidDispose(
            () => {
                this.panel = undefined;
            },
            null,
            []
        );
    }

    private getWebviewContent(): string {
        // Use a non-template string for the HTML content to avoid TypeScript errors
        return [
            '<!DOCTYPE html>',
            '<html lang="en">',
            '<head>',
            '    <meta charset="UTF-8">',
            '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
            '    <title>SecureVibe Configuration</title>',
            '    <style>',
            '        body {',
            '            font-family: var(--vscode-font-family);',
            '            padding: 20px;',
            '            color: var(--vscode-foreground);',
            '        }',
            '        .pattern-form {',
            '            margin-bottom: 20px;',
            '        }',
            '        .pattern-list {',
            '            margin-top: 20px;',
            '        }',
            '        .pattern-item {',
            '            display: flex;',
            '            justify-content: space-between;',
            '            align-items: center;',
            '            padding: 10px;',
            '            border: 1px solid var(--vscode-panel-border);',
            '            margin-bottom: 10px;',
            '        }',
            '        button {',
            '            background-color: var(--vscode-button-background);',
            '            color: var(--vscode-button-foreground);',
            '            border: none;',
            '            padding: 5px 10px;',
            '            cursor: pointer;',
            '        }',
            '        button:hover {',
            '            background-color: var(--vscode-button-hoverBackground);',
            '        }',
            '        input, select {',
            '            background-color: var(--vscode-input-background);',
            '            color: var(--vscode-input-foreground);',
            '            border: 1px solid var(--vscode-input-border);',
            '            padding: 5px;',
            '            margin: 5px 0;',
            '        }',
            '    </style>',
            '</head>',
            '<body>',
            '    <h2>Custom Vulnerability Patterns</h2>',
            '    <div class="pattern-form">',
            '        <h3>Add New Pattern</h3>',
            '        <div>',
            '            <label for="pattern">Regex Pattern:</label>',
            '            <input type="text" id="pattern" placeholder="Enter regex pattern">',
            '        </div>',
            '        <div>',
            '            <label for="description">Description:</label>',
            '            <input type="text" id="description" placeholder="Enter description">',
            '        </div>',
            '        <div>',
            '            <label for="severity">Severity:</label>',
            '            <select id="severity">',
            '                <option value="error">Error</option>',
            '                <option value="warning">Warning</option>',
            '                <option value="info">Info</option>',
            '            </select>',
            '        </div>',
            '        <div>',
            '            <label for="languages">Languages:</label>',
            '            <input type="text" id="languages" placeholder="Comma-separated list of languages">',
            '        </div>',
            '        <button onclick="savePattern()">Add Pattern</button>',
            '    </div>',
            '    <div class="pattern-list">',
            '        <h3>Existing Patterns</h3>',
            '        <div id="patterns"></div>',
            '    </div>',
            '    <script>',
            '        function savePattern() {',
            '            const pattern = document.getElementById("pattern").value;',
            '            const description = document.getElementById("description").value;',
            '            const severity = document.getElementById("severity").value;',
            '            const languages = document.getElementById("languages").value.split(",").map(l => l.trim());',
            '            ',
            '            vscode.postMessage({',
            '                command: "savePattern",',
            '                pattern: {',
            '                    pattern,',
            '                    description,',
            '                    severity,',
            '                    languages',
            '                }',
            '            });',
            '        }',
            '',
            '        function deletePattern(patternId) {',
            '            vscode.postMessage({',
            '                command: "deletePattern",',
            '                patternId',
            '            });',
            '        }',
            '',
            '        function loadPatterns() {',
            '            const patterns = vscode.getState("securevibe.customPatterns") || [];',
            '            const patternsDiv = document.getElementById("patterns");',
            '            patternsDiv.innerHTML = patterns.map((p, i) => {',
            '                return `<div class="pattern-item">',
            '                    <div>',
            '                        <strong>${p.description}</strong><br>',
            '                        Pattern: ${p.pattern}<br>',
            '                        Severity: ${p.severity}<br>',
            '                        Languages: ${p.languages.join(", ")}',
            '                    </div>',
            '                    <button onclick="deletePattern(${i})">Delete</button>',
            '                </div>`;',
            '            }).join("");',
            '        }',
            '',
            '        loadPatterns();',
            '    </script>',
            '</body>',
            '</html>'
        ].join('\n');
    }

    private async saveCustomPattern(pattern: CustomPattern) {
        const config = vscode.workspace.getConfiguration('securevibe');
        const patterns = config.get<CustomPattern[]>('customPatterns') || [];
        patterns.push(pattern);
        await config.update('customPatterns', patterns, true);
        vscode.window.showInformationMessage('Pattern saved successfully');
    }

    private async deleteCustomPattern(patternId: number) {
        const config = vscode.workspace.getConfiguration('securevibe');
        const patterns = config.get<CustomPattern[]>('customPatterns') || [];
        patterns.splice(patternId, 1);
        await config.update('customPatterns', patterns, true);
        vscode.window.showInformationMessage('Pattern deleted successfully');
    }
} 