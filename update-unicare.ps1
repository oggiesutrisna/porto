$ErrorActionPreference = "Stop"

# Define replacements
$replacements = @{
    'logo-light.png" alt="logo"' = 'logo-light.png" alt="Unicare Clinic Logo" style="max-height: 50px; width: auto;"'
    'logo-dark.png" alt="logo"' = 'logo-dark.png" alt="Unicare Clinic Logo" style="max-height: 50px; width: auto;"'
    '24/7 Hotline: +5565454117' = '24/7 Hotline: +62 822 9829 8911'
    'Emergency Line: (002) 01061245741' = '24/7 Hotline: +62 822 9829 8911'
    '01061245741' = '+62 822 9829 8911'
    '+2 01061245741' = '+62 822 9829 8911'
    'Location: Brooklyn, New York' = 'Locations: Kuta, Ubud, Nusa Dua, Uluwatu'
    'Mon - Fri: 8:00 am - 7:00 pm' = 'Open 24/7, Every Day'
    '<a href="#"><i class="fab fa-instagram"></i></a>' = '<a href="https://twitter.com/unicare_clinic" target="_blank"><i class="fab fa-twitter"></i></a>'
    'href="#"><i class="fab fa-twitter"></i>' = 'href="https://www.youtube.com/@unicareclinic" target="_blank"><i class="fab fa-youtube"></i>'
    '© 2020 DataSoft, All Rights Reserved' = '© 2025 Unicare Clinic. All Rights Reserved'
}

# Get all HTML files
$htmlFiles = Get-ChildItem "Unicare Clinic Reforged\*.html"

Write-Host "Processing $($htmlFiles.Count) HTML files..."

foreach ($file in $htmlFiles) {
    Write-Host "Processing $($file.Name)..."

    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8

        foreach ($pattern in $replacements.Keys) {
            $content = $content -replace [regex]::Escape($pattern), $replacements[$pattern]
        }

        Set-Content $file.FullName -Value $content -Encoding UTF8 -NoNewline
    }
    catch {
        Write-Host "Error processing $($file.Name): $_" -ForegroundColor Red
    }
}

Write-Host "Done! All files updated." -ForegroundColor Green
