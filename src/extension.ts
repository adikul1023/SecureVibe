import * as vscode from 'vscode';

// Sample regex pattern to detect potential API keys or sensitive strings
const API_KEY_PATTERN = /(?:api_key|apikey|secret|token)\s*[:=]\s*["']?[A-Za-z0-9]{16,64}["']?/i;
const PASSWORD_PATTERN = /password\s*[:=]\s*["']?[^"']+["']?/i;
const SQL_INJECTION_PATTERN = /(?:SELECT|INSERT|UPDATE|DELETE)\s+.*\s+FROM\s+.*\s+WHERE\s+.*\+\s*["']/i;
const XSS_PATTERN = /innerHTML\s*=\s*["']?[^"']+["']?/i;
const UNSAFE_FILE_PATTERN = /(?:open|readFile|writeFile)\s*\([^)]*\)/i;
const INPUT_VALIDATION_PATTERN = /(?:input|prompt|readline)\s*\([^)]*\)/i;
const HTTP_PATTERN = /http:\/\//i;
const DEBUG_PATTERN = /(?:console\.log|print|debugger)/i;

// Additional vulnerability patterns
const COMMAND_INJECTION_PATTERN = /exec\s*\([^)]*(?:user|input|data)/i;
const PATH_TRAVERSAL_PATTERN = /\.\.\/|\.\.\\|\%2e\%2e\%2f|\%2e\%2e\%5c/i;
const INSECURE_CRYPTO_PATTERN = /md5|sha1|des|rc4/i;
const EVAL_PATTERN = /eval\s*\([^)]*\)/i;
const CORS_PATTERN = /Access-Control-Allow-Origin:\s*\*/i;
const SENSITIVE_DATA_PATTERN = /social|credit|ssn|passport/i;

interface Vulnerability {
    pattern: RegExp;
    description: string;
    severity: vscode.DiagnosticSeverity;
    quickFix?: {
        title: string;
        edit: string | ((line: string) => string);
    };
}

const vulnerabilities: Vulnerability[] = [
    {
        pattern: API_KEY_PATTERN,
        description: 'Exposed API key or credential',
        severity: vscode.DiagnosticSeverity.Error,
        quickFix: {
            title: 'Move to environment variable',
            edit: (line: string) => {
                const match = line.match(/(\w+)\s*[:=]\s*["']?([^"']+)["']?/);
                if (match) {
                    return `${match[1]} = process.env.${match[1].toUpperCase()}`;
                }
                return line;
            }
        }
    },
    {
        pattern: PASSWORD_PATTERN,
        description: 'Hardcoded password',
        severity: vscode.DiagnosticSeverity.Error,
        quickFix: {
            title: 'Move to environment variable',
            edit: (line: string) => {
                const match = line.match(/(\w+)\s*[:=]\s*["']?([^"']+)["']?/);
                if (match) {
                    return `${match[1]} = process.env.${match[1].toUpperCase()}`;
                }
                return line;
            }
        }
    },
    {
        pattern: SQL_INJECTION_PATTERN,
        description: 'Potential SQL injection vulnerability',
        severity: vscode.DiagnosticSeverity.Error,
        quickFix: {
            title: 'Use parameterized queries',
            edit: (line: string) => {
                return line.replace(/\+.*["']/, '?');
            }
        }
    },
    {
        pattern: XSS_PATTERN,
        description: 'Potential XSS vulnerability',
        severity: vscode.DiagnosticSeverity.Warning,
        quickFix: {
            title: 'Use textContent instead',
            edit: (line: string) => {
                return line.replace('innerHTML', 'textContent');
            }
        }
    },
    {
        pattern: UNSAFE_FILE_PATTERN,
        description: 'Unsafe file operation without proper error handling',
        severity: vscode.DiagnosticSeverity.Warning,
        quickFix: {
            title: 'Add try-catch block',
            edit: (line: string) => {
                return `try {\n    ${line}\n} catch (error) {\n    console.error('File operation failed:', error);\n}`;
            }
        }
    },
    {
        pattern: INPUT_VALIDATION_PATTERN,
        description: 'Missing input validation',
        severity: vscode.DiagnosticSeverity.Warning,
        quickFix: {
            title: 'Add input validation',
            edit: (line: string) => {
                return `${line}\nif (!input.trim()) {\n    throw new Error('Input cannot be empty');\n}`;
            }
        }
    },
    {
        pattern: HTTP_PATTERN,
        description: 'Insecure HTTP connection',
        severity: vscode.DiagnosticSeverity.Warning,
        quickFix: {
            title: 'Use HTTPS instead',
            edit: (line: string) => {
                return line.replace('http://', 'https://');
            }
        }
    },
    {
        pattern: DEBUG_PATTERN,
        description: 'Debug statement in production code',
        severity: vscode.DiagnosticSeverity.Information,
        quickFix: {
            title: 'Remove debug statement',
            edit: (line: string) => {
                return '';
            }
        }
    },
    {
        pattern: COMMAND_INJECTION_PATTERN,
        description: "Potential command injection vulnerability detected. Use safe command execution methods.",
        severity: vscode.DiagnosticSeverity.Error,
        quickFix: {
            title: "Use child_process.execFile instead",
            edit: "execFile"
        }
    },
    {
        pattern: PATH_TRAVERSAL_PATTERN,
        description: "Path traversal vulnerability detected. Validate and sanitize file paths.",
        severity: vscode.DiagnosticSeverity.Error,
        quickFix: {
            title: "Use path.normalize",
            edit: "path.normalize(filePath)"
        }
    },
    {
        pattern: INSECURE_CRYPTO_PATTERN,
        description: "Insecure cryptographic algorithm detected. Use modern alternatives.",
        severity: vscode.DiagnosticSeverity.Warning,
        quickFix: {
            title: "Use secure algorithm",
            edit: "crypto.createHash('sha256')"
        }
    },
    {
        pattern: EVAL_PATTERN,
        description: "Dangerous eval() detected. Avoid using eval for security reasons.",
        severity: vscode.DiagnosticSeverity.Error,
        quickFix: {
            title: "Remove eval",
            edit: "JSON.parse"
        }
    },
    {
        pattern: CORS_PATTERN,
        description: "Overly permissive CORS policy detected. Specify allowed origins explicitly.",
        severity: vscode.DiagnosticSeverity.Warning,
        quickFix: {
            title: "Restrict CORS",
            edit: "Access-Control-Allow-Origin: https://trusted-domain.com"
        }
    },
    {
        pattern: SENSITIVE_DATA_PATTERN,
        description: "Potential sensitive data exposure detected. Ensure proper data protection.",
        severity: vscode.DiagnosticSeverity.Warning,
        quickFix: {
            title: "Add data protection",
            edit: "// TODO: Implement data encryption and access controls"
        }
    }
];

export function activate(context: vscode.ExtensionContext) {
    console.log('SecureVibe is now active!');

    // Create a diagnostic collection
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('securevibe');
    context.subscriptions.push(diagnosticCollection);

    // Function to scan a document for vulnerabilities
    function scanDocument(document: vscode.TextDocument) {
        const text = document.getText();
        const issues: vscode.Diagnostic[] = [];

        // Scan each line
        const lines = text.split('\n');
        lines.forEach((line, lineNumber) => {
            vulnerabilities.forEach(vulnerability => {
                if (vulnerability.pattern.test(line)) {
                    const range = new vscode.Range(
                        new vscode.Position(lineNumber, 0),
                        new vscode.Position(lineNumber, line.length)
                    );

                    const diagnostic = new vscode.Diagnostic(
                        range,
                        vulnerability.description,
                        vulnerability.severity
                    );

                    diagnostic.source = 'SecureVibe';
                    
                    // Add quick fix if available
                    if (vulnerability.quickFix) {
                        const fix = vulnerability.quickFix;
                        const command: vscode.Command = {
                            title: fix.title,
                            command: 'securevibe.applyQuickFix',
                            arguments: [document, range, vulnerability]
                        };
                        diagnostic.code = 'quick-fix';
                        (diagnostic as any).command = command;  // Using type assertion as command is not in the type definition
                    }

                    issues.push(diagnostic);
                }
            });
        });

        diagnosticCollection.set(document.uri, issues);
        return issues;
    }

    // Register the command to scan the current file
    let disposable = vscode.commands.registerCommand('securevibe.scanFile', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found');
            return;
        }

        const issues = scanDocument(editor.document);
        
        if (issues.length > 0) {
            vscode.window.showWarningMessage(`Found ${issues.length} security issues in ${editor.document.fileName}`);
        } else {
            vscode.window.showInformationMessage('No security issues found!');
        }
    });

    // Register quick fix provider
    const quickFixProvider = vscode.languages.registerCodeActionsProvider(
        { pattern: '**/*' },
        {
            provideCodeActions(document, range, context) {
                const actions: vscode.CodeAction[] = [];
                
                context.diagnostics.forEach(diagnostic => {
                    if (diagnostic.source === 'SecureVibe') {
                        const vulnerability = vulnerabilities.find(v => v.description === diagnostic.message);
                        if (vulnerability?.quickFix) {
                            const action = new vscode.CodeAction(
                                vulnerability.quickFix.title,
                                vscode.CodeActionKind.QuickFix
                            );
                            
                            action.edit = new vscode.WorkspaceEdit();
                            const line = document.lineAt(range.start.line).text;
                            const fixedLine = typeof vulnerability.quickFix.edit === 'function' 
                                ? vulnerability.quickFix.edit(line)
                                : vulnerability.quickFix.edit;
                            
                            if (fixedLine === '') {
                                action.edit.delete(document.uri, new vscode.Range(range.start.line, 0, range.start.line + 1, 0));
                            } else {
                                action.edit.replace(document.uri, range, fixedLine);
                            }
                            
                            actions.push(action);
                        }
                    }
                });
                
                return actions;
            }
        }
    );

    context.subscriptions.push(disposable, quickFixProvider);

    // Add automatic scanning on file save
    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument(document => {
            scanDocument(document);
        })
    );
}

export function deactivate() {} 