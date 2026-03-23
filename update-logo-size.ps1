$ErrorActionPreference = "Stop"

# Update logo size
$htmlFiles = Get-ChildItem "public\unicare-clinic\*.html"

Write-Host "Updating logo size in $($htmlFiles.Count) HTML files..."

foreach ($file in $htmlFiles) {
    Write-Host "Processing $($file.Name)..."

    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8

        # Update logo size from 50px to 35px
        $content = $content -replace 'max-height: 50px;', 'max-height: 35px;'

        Set-Content $file.FullName -Value $content -Encoding UTF8 -NoNewline
    }
    catch {
        Write-Host "Error processing $($file.Name): $_" -ForegroundColor Red
    }
}

Write-Host "Done! Logo size updated to 35px." -ForegroundColor Green
