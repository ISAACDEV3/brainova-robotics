Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\ISAAC\.gemini\antigravity\brain\95425386-5264-4c8d-bf58-b954b11a8278\.user_uploaded\media_1786717915709.jpg"
$destPath = "C:\Users\ISAAC\OneDrive\Desktop\Brainova2026\brainova-robotics\assets\images\robot.png"

$bmp = [System.Drawing.Bitmap]::FromFile($sourcePath)
$bmp2 = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp2)
# Use HighQuality interpolation
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($bmp, 0, 0, $bmp.Width, $bmp.Height)
$g.Dispose()
$bmp.Dispose()

$width = $bmp2.Width
$height = $bmp2.Height

# High quality edge smoothing / background removal
# We assume the outer boundary is white.
# We will make pixels transparent based on their distance from pure white (255,255,255)
# This provides perfect anti-aliased edges instead of jagged pixels.

for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $c = $bmp2.GetPixel($x, $y)
        # If it's pure white or very close, make it fully transparent
        if ($c.R -ge 250 -and $c.G -ge 250 -and $c.B -ge 250) {
            $bmp2.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        }
        # Edge blending for anti-aliasing (pixels between 200 and 250 brightness)
        elseif ($c.R -gt 200 -and $c.G -gt 200 -and $c.B -gt 200) {
            # Calculate how white it is (255 = fully white, 200 = somewhat white)
            # The closer to 255, the more transparent (lower alpha)
            $avg = ($c.R + $c.G + $c.B) / 3.0
            
            # Map 200->255 to Alpha 255->0
            $alpha = 255 - [Math]::Min(255, [Math]::Max(0, [int]((($avg - 200) / 50.0) * 255)))
            
            # We want to keep the original color but reduce its alpha
            $newColor = [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B)
            $bmp2.SetPixel($x, $y, $newColor)
        }
    }
}

$bmp2.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp2.Dispose()

Write-Host "Successfully generated high-quality anti-aliased transparent PNG at $destPath"
