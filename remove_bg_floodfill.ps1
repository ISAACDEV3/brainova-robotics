Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\ISAAC\.gemini\antigravity\brain\95425386-5264-4c8d-bf58-b954b11a8278\.user_uploaded\media_1786721007360.png"
$destPath = "C:\Users\ISAAC\OneDrive\Desktop\Brainova2026\brainova-robotics\assets\images\robot.png"

$bmp = [System.Drawing.Bitmap]::FromFile($sourcePath)
$bmp2 = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp2)
$g.DrawImage($bmp, 0, 0)
$g.Dispose()
$bmp.Dispose()

$width = $bmp2.Width
$height = $bmp2.Height

# We will flood-fill from all 4 corners to remove the background white.
$queue = New-Object System.Collections.Generic.Queue[System.Drawing.Point]
$queue.Enqueue((New-Object System.Drawing.Point(0, 0)))
$queue.Enqueue((New-Object System.Drawing.Point(($width - 1), 0)))
$queue.Enqueue((New-Object System.Drawing.Point(0, ($height - 1))))
$queue.Enqueue((New-Object System.Drawing.Point(($width - 1), ($height - 1))))

$visited = New-Object "bool[,]" $width, $height

while ($queue.Count -gt 0) {
    $p = $queue.Dequeue()
    $x = $p.X
    $y = $p.Y
    
    if ($x -lt 0 -or $x -ge $width -or $y -lt 0 -or $y -ge $height) { continue }
    if ($visited[$x, $y]) { continue }
    
    $visited[$x, $y] = $true
    $c = $bmp2.GetPixel($x, $y)
    
    # If the pixel is light-colored (background), we make it transparent and continue filling.
    # The thick black border of the robot will stop the flood fill because its RGB values are low.
    if ($c.R -gt 220 -and $c.G -gt 220 -and $c.B -gt 220) {
        $bmp2.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        $queue.Enqueue((New-Object System.Drawing.Point(($x + 1), $y)))
        $queue.Enqueue((New-Object System.Drawing.Point(($x - 1), $y)))
        $queue.Enqueue((New-Object System.Drawing.Point($x, ($y + 1))))
        $queue.Enqueue((New-Object System.Drawing.Point($x, ($y - 1))))
    }
}

$bmp2.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp2.Dispose()

Write-Host "Successfully generated transparent PNG using Flood Fill at $destPath"
