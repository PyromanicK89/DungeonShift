Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $root "assets\dungeonshift2.png"
$outRoot = Join-Path $root "assets\map"

New-Item -ItemType Directory -Force $outRoot | Out-Null

$assets = @(
  @{ name="backgrounds/dark_forest"; x=0; y=0; w=870; h=1024; keepBg=$true },
  @{ name="variations/grassland"; x=904; y=784; w=151; h=194; keepBg=$true },
  @{ name="variations/dark_forest"; x=1064; y=784; w=151; h=194; keepBg=$true },
  @{ name="variations/volcanic"; x=1227; y=784; w=151; h=194; keepBg=$true },
  @{ name="variations/snowfield"; x=1386; y=784; w=151; h=194; keepBg=$true },

  @{ name="decor/tree_pine_0"; x=909; y=326; w=55; h=92 },
  @{ name="decor/tree_pine_1"; x=969; y=326; w=56; h=92 },
  @{ name="decor/dead_tree"; x=1035; y=331; w=67; h=90 },
  @{ name="decor/rocks_0"; x=1120; y=342; w=58; h=62 },
  @{ name="decor/stump"; x=1199; y=330; w=45; h=58 },
  @{ name="decor/barrel"; x=1263; y=331; w=44; h=48 },
  @{ name="decor/crate"; x=1318; y=339; w=43; h=43 },
  @{ name="decor/ruin_tower"; x=1422; y=321; w=85; h=126 },
  @{ name="decor/tent"; x=1117; y=462; w=90; h=92 },
  @{ name="decor/torch"; x=1312; y=519; w=36; h=68 },
  @{ name="decor/purple_crystal"; x=904; y=631; w=36; h=62 },
  @{ name="decor/portal"; x=1405; y=171; w=72; h=78 },
  @{ name="decor/altar"; x=1312; y=650; w=95; h=56 },
  @{ name="decor/banner_red"; x=1270; y=389; w=41; h=88 },
  @{ name="decor/banner_blue"; x=1345; y=392; w=41; h=82 }
)

function Is-Dark([System.Drawing.Color] $c) {
  return ($c.A -gt 0 -and $c.R -lt 20 -and $c.G -lt 27 -and $c.B -lt 31)
}

function Remove-Border-Dark([System.Drawing.Bitmap] $bmp) {
  $w = $bmp.Width
  $h = $bmp.Height
  $seen = New-Object 'bool[,]' $w, $h
  $queue = New-Object System.Collections.Generic.Queue[object]

  function Try-Enqueue([int] $x, [int] $y) {
    if ($x -lt 0 -or $y -lt 0 -or $x -ge $w -or $y -ge $h -or $seen[$x,$y]) { return }
    $seen[$x,$y] = $true
    if (Is-Dark $bmp.GetPixel($x, $y)) {
      $queue.Enqueue(@($x, $y))
    }
  }

  for ($x = 0; $x -lt $w; $x++) {
    Try-Enqueue $x 0
    Try-Enqueue $x ($h - 1)
  }
  for ($y = 0; $y -lt $h; $y++) {
    Try-Enqueue 0 $y
    Try-Enqueue ($w - 1) $y
  }

  while ($queue.Count -gt 0) {
    $p = $queue.Dequeue()
    $x = [int]$p[0]
    $y = [int]$p[1]
    $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    Try-Enqueue ($x + 1) $y
    Try-Enqueue ($x - 1) $y
    Try-Enqueue $x ($y + 1)
    Try-Enqueue $x ($y - 1)
  }
}

$source = [System.Drawing.Bitmap]::FromFile($sourcePath)
try {
  foreach ($asset in $assets) {
    $dir = Join-Path $outRoot (Split-Path $asset.name -Parent)
    New-Item -ItemType Directory -Force $dir | Out-Null
    $outPath = Join-Path $outRoot ($asset.name + ".png")
    $crop = New-Object System.Drawing.Bitmap $asset.w, $asset.h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($crop)
    try {
      $graphics.Clear([System.Drawing.Color]::Transparent)
      $srcRect = New-Object System.Drawing.Rectangle $asset.x, $asset.y, $asset.w, $asset.h
      $dstRect = New-Object System.Drawing.Rectangle 0, 0, $asset.w, $asset.h
      $graphics.DrawImage($source, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    } finally {
      $graphics.Dispose()
    }
    if (-not $asset.keepBg) {
      Remove-Border-Dark $crop
    }
    $crop.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
  }
} finally {
  $source.Dispose()
}

Write-Host "Extracted $($assets.Count) map assets to $outRoot"
