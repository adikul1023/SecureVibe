# SecureVibe

A security-focused VS Code extension that helps you identify potential vulnerabilities in your code.

## Installation

### From VS Code Marketplace (Coming Soon)
1. Open VS Code
2. Click on the Extensions icon in the sidebar (or press `Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "SecureVibe"
4. Click "Install"

### From Source
1. Clone this repository:
   ```bash
   git clone https://github.com/adikul1023/SecureVibe.git
   ```
2. Navigate to the project directory:
   ```bash
   cd SecureVibe
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the extension:
   ```bash
   npm run compile
   ```
5. Package the extension:
   ```bash
   vsce package
   ```
6. Install the generated .vsix file in VS Code:
   - Press `Ctrl+Shift+P` / `Cmd+Shift+P`
   - Type "Extensions: Install from VSIX"
   - Select the generated .vsix file

### Testing the Extension

After installation, you can test the extension:

1. Press `F5` to open a new VS Code window with the extension running
2. Open any file you want to scan for security issues
3. Press `Ctrl+Shift+P` / `Cmd+Shift+P` to open the Command Palette
4. Type "Scan Current File for Security Issues"
5. Press Enter to start the scan
6. Review the identified issues in the Problems panel

## Features

SecureVibe scans your code for various security vulnerabilities and provides quick fixes for common issues:

### Security Checks
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

### Quick Fixes
The extension provides automatic fixes for many common issues:
- Converting hardcoded credentials to environment variables
- Replacing unsafe functions with secure alternatives
- Adding proper error handling
- Converting HTTP to HTTPS
- Removing debug statements
- And more...

## Usage

### Manual Scanning
1. Open a file you want to scan in VS Code
2. Open the Command Palette:
   - Windows/Linux: Press `Ctrl+Shift+P`
   - macOS: Press `Cmd+Shift+P`
3. Type "Scan Current File for Security Issues"
4. Press Enter to start the scan

### Automatic Scanning
The extension automatically scans files when you save them. To disable this:
1. Open VS Code Settings:
   - Windows/Linux: `Ctrl+,`
   - macOS: `Cmd+,`
2. Search for "securevibe.scanOnSave"
3. Uncheck the setting to disable automatic scanning

### Working with Issues
1. Issues appear in the Problems panel (View → Problems or `Ctrl+Shift+M`)
2. Click on an issue to jump to its location in the code
3. Hover over the highlighted code to see:
   - Detailed description of the issue
   - Security impact
   - Available quick fixes
4. Click the lightbulb icon (💡) or press `Ctrl+.` to see and apply quick fixes

### Best Practices
- Run scans before committing code
- Review all suggested fixes before applying them
- Use the extension as part of your security review process, not as your only security measure
- Keep the extension updated for the latest security checks

## Extension Settings

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