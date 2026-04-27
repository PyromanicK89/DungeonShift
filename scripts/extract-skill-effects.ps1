Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $root "assets\skill-effects-sheet.png"
$outRoot = Join-Path $root "assets\skill-effects"

New-Item -ItemType Directory -Force $outRoot | Out-Null

$effects = @(
  @{ name="knight/sword_slash"; x=185; y=92; w=260; h=175 },
  @{ name="knight/dash_slash"; x=478; y=105; w=290; h=150 },
  @{ name="knight/shield_bash"; x=810; y=100; w=250; h=155 },
  @{ name="knight/holy_strike"; x=1168; y=68; w=210; h=205 },

  @{ name="mage/fireball"; x=205; y=437; w=280; h=120 },
  @{ name="mage/ice_shard"; x=574; y=427; w=210; h=125 },
  @{ name="mage/lightning_bolt"; x=825; y=432; w=220; h=130 },
  @{ name="mage/arcane_bolt"; x=1110; y=436; w=270; h=130 },

  @{ name="elf/arrow_shot"; x=198; y=784; w=285; h=75 },
  @{ name="elf/multishot"; x=570; y=760; w=225; h=125 },
  @{ name="elf/piercing_arrow"; x=835; y=782; w=270; h=85 },
  @{ name="elf/spinning_leaf"; x=1175; y=720; w=230; h=165 }
)

function Is-TransparentBg([System.Drawing.Color] $c) {
  return ($c.A -gt 0 -and $c.R -lt 65 -and $c.G -lt 65 -and $c.B -lt 55)
}

function Remove-Border-Bg([System.Drawing.Bitmap] $bmp) {
  $w = $bmp.Width
  $h = $bmp.Height
  $seen = New-Object 'bool[,]' $w, $h
  $queue = New-Object System.Collections.Generic.Queue[object]

  function Try-Enqueue([int] $x, [int] $y) {
    if ($x -lt 0 -or $y -lt 0 -or $x -ge $w -or $y -ge $h -or $seen[$x,$y]) { return }
    $seen[$x,$y] = $true
    if (Is-TransparentBg $bmp.GetPixel($x, $y)) {
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
  foreach ($effect in $effects) {
    $dir = Join-Path $outRoot (Split-Path $effect.name -Parent)
    New-Item -ItemType Directory -Force $dir | Out-Null
    $outPath = Join-Path $outRoot ($effect.name + ".png")
    $crop = New-Object System.Drawing.Bitmap $effect.w, $effect.h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($crop)
    try {
      $graphics.Clear([System.Drawing.Color]::Transparent)
      $srcRect = New-Object System.Drawing.Rectangle $effect.x, $effect.y, $effect.w, $effect.h
      $dstRect = New-Object System.Drawing.Rectangle 0, 0, $effect.w, $effect.h
      $graphics.DrawImage($source, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    } finally {
      $graphics.Dispose()
    }
    Remove-Border-Bg $crop
    $crop.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
  }
} finally {
  $source.Dispose()
}

Write-Host "Extracted $($effects.Count) skill effects to $outRoot"
