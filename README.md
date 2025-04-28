# SecureVibe

A security-focused VS Code extension that helps you identify potential vulnerabilities in your code.

## Features

- Detects various security vulnerabilities including:
  - Exposed API keys and credentials
  - Hardcoded passwords
  - SQL injection vulnerabilities
  - XSS vulnerabilities
  - Unsafe file operations
  - Missing input validation
  - Insecure HTTP connections
  - Debug statements in production code
  - Command injection vulnerabilities
  - Path traversal vulnerabilities
  - Insecure cryptographic algorithms
  - Dangerous eval() usage
  - Overly permissive CORS policies
  - Sensitive data exposure

- Provides quick fixes for identified issues
- Automatic scanning on file save
- Manual scanning through command palette

## Usage

1. Open a file you want to scan
2. Use the command palette (Ctrl+Shift+P / Cmd+Shift+P)
3. Type "Scan Current File for Security Issues"
4. Review the identified issues in the Problems panel

## Requirements

- VS Code 1.60.0 or higher

## Extension Settings

This extension contributes the following settings:

* `securevibe.enable`: Enable/disable the extension
* `securevibe.scanOnSave`: Enable/disable automatic scanning on file save

## Known Issues

None at the moment.

## Release Notes

### 0.1.0

Initial release of SecureVibe with basic vulnerability detection and quick fixes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 