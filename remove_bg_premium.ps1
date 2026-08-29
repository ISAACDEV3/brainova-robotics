Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\ISAAC\.gemini\antigravity\brain\95425386-5264-4c8d-bf58-b954b11a8278\.user_uploaded\media_1786721007360.png"
$destPath = "C:\Users\ISAAC\OneDrive\Desktop\Brainova2026\brainova-robotics\assets\images\robot.png"

$bmp = [System.Drawing.Bitmap]::FromFile($sourcePath)
$width = $bmp.Width
$height = $bmp.Height
$bmp2 = New-Object System.Drawing.Bitmap($width, $height)

$g = [System.Drawing.Graphics]::FromImage($bmp2)
$g.DrawImage($bmp, 0, 0)
$g.Dispose()
$bmp.Dispose()

# Step 1: Flood fill to find all definite background pixels
$queue = New-Object System.Collections.Generic.Queue[System.Drawing.Point]
$queue.Enqueue((New-Object System.Drawing.Point(0, 0)))
$queue.Enqueue((New-Object System.Drawing.Point(($width - 1), 0)))
$queue.Enqueue((New-Object System.Drawing.Point(0, ($height - 1))))
$queue.Enqueue((New-Object System.Drawing.Point(($width - 1), ($height - 1))))

$isBg = New-Object "bool[,]" $width, $height

while ($queue.Count -gt 0) {
    $p = $queue.Dequeue()
    $x = $p.X
    $y = $p.Y
    
    if ($x -lt 0 -or $x -ge $width -or $y -lt 0 -or $y -ge $height) { continue }
    if ($isBg[$x, $y]) { continue }
    
    $c = $bmp2.GetPixel($x, $y)
    
    if ($c.R -gt 210 -and $c.G -gt 210 -and $c.B -gt 210) {
        $isBg[$x, $y] = $true
        $queue.Enqueue((New-Object System.Drawing.Point(($x + 1), $y)))
        $queue.Enqueue((New-Object System.Drawing.Point(($x - 1), $y)))
        $queue.Enqueue((New-Object System.Drawing.Point($x, ($y + 1))))
        $queue.Enqueue((New-Object System.Drawing.Point($x, ($y - 1))))
    }
}

# Step 2: Apply smooth Alpha Anti-aliasing to the edges
for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        if ($isBg[$x, $y]) {
            $bmp2.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        } else {
            $isEdge = $false
            $xm1 = $x - 1
            $xp1 = $x + 1
            $ym1 = $y - 1
            $yp1 = $y + 1
            
            if ($x -gt 0 -and $isBg[$xm1, $y]) { $isEdge = $true }
            if ($x -lt ($width - 1) -and $isBg[$xp1, $y]) { $isEdge = $true }
            if ($y -gt 0 -and $isBg[$x, $ym1]) { $isEdge = $true }
            if ($y -lt ($height - 1) -and $isBg[$x, $yp1]) { $isEdge = $true }
            
            if ($isEdge) {
                $c = $bmp2.GetPixel($x, $y)
                # 50% opacity for perfect blending
                $newColor = [System.Drawing.Color]::FromArgb(128, $c.R, $c.G, $c.B)
                $bmp2.SetPixel($x, $y, $newColor)
            }
        }
    }
}

$bmp2.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp2.Dispose()

Write-Host "Successfully generated premium anti-aliased PNG at $destPath"
