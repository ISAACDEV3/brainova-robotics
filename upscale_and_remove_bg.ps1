Add-Type -AssemblyName System.Drawing

# The low-res but correct-color original image
$sourcePath = "C:\Users\ISAAC\.gemini\antigravity\brain\95425386-5264-4c8d-bf58-b954b11a8278\.user_uploaded\media_1786721007360.png"
$destPath = "C:\Users\ISAAC\OneDrive\Desktop\Brainova2026\brainova-robotics\assets\images\robot.png"

$bmp = [System.Drawing.Bitmap]::FromFile($sourcePath)

# Upscale by 4x for premium crispness (150x150 -> 600x600)
$scale = 4
$newWidth = $bmp.Width * $scale
$newHeight = $bmp.Height * $scale

$upscaledBmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
$g = [System.Drawing.Graphics]::FromImage($upscaledBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($bmp, 0, 0, $newWidth, $newHeight)
$g.Dispose()
$bmp.Dispose()

# Now we perform premium flood-fill background removal on the upscaled image
$queue = New-Object System.Collections.Generic.Queue[System.Drawing.Point]
$queue.Enqueue((New-Object System.Drawing.Point(0, 0)))
$queue.Enqueue((New-Object System.Drawing.Point(($newWidth - 1), 0)))
$queue.Enqueue((New-Object System.Drawing.Point(0, ($newHeight - 1))))
$queue.Enqueue((New-Object System.Drawing.Point(($newWidth - 1), ($newHeight - 1))))

$isBg = New-Object "bool[,]" $newWidth, $newHeight

while ($queue.Count -gt 0) {
    $p = $queue.Dequeue()
    $x = $p.X
    $y = $p.Y
    
    if ($x -lt 0 -or $x -ge $newWidth -or $y -lt 0 -or $y -ge $newHeight) { continue }
    if ($isBg[$x, $y]) { continue }
    
    $c = $upscaledBmp.GetPixel($x, $y)
    
    if ($c.R -gt 210 -and $c.G -gt 210 -and $c.B -gt 210) {
        $isBg[$x, $y] = $true
        $queue.Enqueue((New-Object System.Drawing.Point(($x + 1), $y)))
        $queue.Enqueue((New-Object System.Drawing.Point(($x - 1), $y)))
        $queue.Enqueue((New-Object System.Drawing.Point($x, ($y + 1))))
        $queue.Enqueue((New-Object System.Drawing.Point($x, ($y - 1))))
    }
}

# Apply Alpha Matting (Anti-Aliasing) to the upscaled edge
for ($y = 0; $y -lt $newHeight; $y++) {
    for ($x = 0; $x -lt $newWidth; $x++) {
        if ($isBg[$x, $y]) {
            $upscaledBmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        } else {
            $isEdge = $false
            $xm1 = $x - 1
            $xp1 = $x + 1
            $ym1 = $y - 1
            $yp1 = $y + 1
            
            if ($x -gt 0 -and $isBg[$xm1, $y]) { $isEdge = $true }
            if ($x -lt ($newWidth - 1) -and $isBg[$xp1, $y]) { $isEdge = $true }
            if ($y -gt 0 -and $isBg[$x, $ym1]) { $isEdge = $true }
            if ($y -lt ($newHeight - 1) -and $isBg[$x, $yp1]) { $isEdge = $true }
            
            if ($isEdge) {
                $c = $upscaledBmp.GetPixel($x, $y)
                $newColor = [System.Drawing.Color]::FromArgb(160, $c.R, $c.G, $c.B)
                $upscaledBmp.SetPixel($x, $y, $newColor)
            }
        }
    }
}

$upscaledBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
$upscaledBmp.Dispose()

Write-Host "Successfully generated HQ upscaled transparent PNG at $destPath"
