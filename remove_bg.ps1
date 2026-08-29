Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\ISAAC\.gemini\antigravity\brain\95425386-5264-4c8d-bf58-b954b11a8278\.user_uploaded\media_1786717915709.jpg"
$destPath = "C:\Users\ISAAC\OneDrive\Desktop\Brainova2026\brainova-robotics\assets\images\robot.png"

$bmp = [System.Drawing.Bitmap]::FromFile($sourcePath)
$bmp2 = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp2)
$g.DrawImage($bmp, 0, 0)
$g.Dispose()
$bmp.Dispose()

# Simple flood fill using BFS
$width = [int]$bmp2.Width
$height = [int]$bmp2.Height
$w1 = $width - 1
$h1 = $height - 1

$queue = New-Object System.Collections.Generic.Queue[System.Drawing.Point]
$queue.Enqueue((New-Object System.Drawing.Point(0, 0)))
$queue.Enqueue((New-Object System.Drawing.Point($w1, 0)))
$queue.Enqueue((New-Object System.Drawing.Point(0, $h1)))
$queue.Enqueue((New-Object System.Drawing.Point($w1, $h1)))

$visited = New-Object "bool[,]" $width, $height

while ($queue.Count -gt 0) {
    $p = $queue.Dequeue()
    $x = $p.X
    $y = $p.Y
    
    if ($x -lt 0 -or $x -ge $width -or $y -lt 0 -or $y -ge $height) { continue }
    if ($visited[$x, $y]) { continue }
    
    $visited[$x, $y] = $true
    $c = $bmp2.GetPixel($x, $y)
    
    # tolerance for white background
    if ($c.R -gt 230 -and $c.G -gt 230 -and $c.B -gt 230) {
        $bmp2.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        $queue.Enqueue((New-Object System.Drawing.Point(($x + 1), $y)))
        $queue.Enqueue((New-Object System.Drawing.Point(($x - 1), $y)))
        $queue.Enqueue((New-Object System.Drawing.Point($x, ($y + 1))))
        $queue.Enqueue((New-Object System.Drawing.Point($x, ($y - 1))))
    }
}

$bmp2.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp2.Dispose()

Write-Host "Successfully generated transparent PNG at $destPath"
