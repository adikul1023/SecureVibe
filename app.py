import re

# Sample regex pattern to detect potential API keys or sensitive strings
API_KEY_PATTERN = r'(?i)(?:api_key|apikey|secret|token)\s*[:=]\s*["\']?[A-Za-z0-9]{16,64}["\']?'

def scan_code_for_vulnerabilities(code_content):
    """
    Scans the provided code for common security vulnerabilities.
    Args:
        code_content (str): The code to analyze.
    Returns:
        list: A list of detected issues with descriptions.
    """
    issues = []
    
    # Split code into lines for detailed reporting
    lines = code_content.split('\n')
    
    # Check for exposed API keys or credentials
    for i, line in enumerate(lines, 1):
        if re.search(API_KEY_PATTERN, line):
            issues.append({
                'line': i,
                'issue': 'Potential exposed API key or credential',
                'fix': 'Store sensitive data in environment variables or a secret manager.'
            })
    
    # Placeholder for additional checks (e.g., input validation, auth)
    # This could be expanded with more patterns or AST parsing
    if 'input(' in code_content or 'request.get(' in code_content:
        if 'strip()' not in code_content and 'sanitize' not in code_content:
            issues.append({
                'line': 'N/A',
                'issue': 'Possible lack of input validation',
                'fix': 'Add input sanitization (e.g., strip(), escape()) to prevent injection attacks.'
            })
    
    return issues

def generate_report(issues):
    """
    Generates a user-friendly report from the scan results.
    """
    if not issues:
        return "No vulnerabilities detected. Great job!"
    
    report = "Security Issues Found:\n\n"
    for issue in issues:
        report += f"- Line {issue['line']}: {issue['issue']}\n"
        report += f"  Fix: {issue['fix']}\n\n"
    return report

# Example usage
if __name__ == "__main__":
    sample_code = """
    api_key = "sk_test_1234567890abcdef"
    user_input = input("Enter your name: ")
    print(user_input)
    """
    
    vulnerabilities = scan_code_for_vulnerabilities(sample_code)
    report = generate_report(vulnerabilities)
    print(report)