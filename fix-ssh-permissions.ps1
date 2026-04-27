# Fix SSH key permissions for Windows
# This script sets the correct permissions for SSH private key files

param(
    [Parameter(Mandatory=$true)]
    [string]$KeyPath
)

if (-not (Test-Path $KeyPath)) {
    Write-Host "Error: SSH key file not found at: $KeyPath" -ForegroundColor Red
    exit 1
}

Write-Host "Fixing permissions for: $KeyPath" -ForegroundColor Yellow

try {
    # Remove inheritance and all existing permissions
    icacls $KeyPath /inheritance:r | Out-Null
    
    # Grant read-only access to current user only
    $currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
    icacls $KeyPath /grant:r "${currentUser}:R" | Out-Null
    
    Write-Host "✓ Permissions fixed successfully!" -ForegroundColor Green
    Write-Host "  Key is now accessible only by: $currentUser" -ForegroundColor Gray
    
    # Verify permissions
    Write-Host "`nCurrent permissions:" -ForegroundColor Cyan
    icacls $KeyPath
    
} catch {
    Write-Host "Error fixing permissions: $_" -ForegroundColor Red
    exit 1
}
