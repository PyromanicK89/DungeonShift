Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $root "assets\skillsheet.png"
$outRoot = Join-Path $root "assets\skills"

New-Item -ItemType Directory -Force $outRoot | Out-Null

$skills = @(
  @{ name="knight/sword_slash"; x=178; y=78; w=260; h=155 },
  @{ name="knight/dash_slash"; x=482; y=78; w=260; h=155 },
  @{ name="knight/shield_bash"; x=786; y=78; w=260; h=155 },
  @{ name="knight/holy_strike"; x=1110; y=66; w=260; h=170 },

  @{ name="mage/fireball"; x=150; y=438; w=280; h=122 },
  @{ name="mage/ice_shard"; x=470; y=438; w=270; h=122 },
  @{ name="mage/lightning_bolt"; x=785; y=438; w=260; h=122 },
  @{ name="mage/arcane_bolt"; x=1100; y=438; w=275; h=122 },

  @{ name="elf/arrow_shot"; x=150; y=762; w=280; h=105 },
  @{ name="elf/multishot"; x=470; y=750; w=275; h=122 },
  @{ name="elf/piercing_arrow"; x=785; y=760; w=270; h=105 },
  @{ name="elf/spinning_leaf"; x=1100; y=706; w=275; h=170 }
)

function Is-Dark([System.Drawing.Color] $c) {
  return ($c.A -gt 0 -and $c.R -lt 18 -and $c.G -lt 18 -and $c.B -lt 18)
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
  foreach ($skill in $skills) {
    $dir = Join-Path $outRoot (Split-Path $skill.name -Parent)
    New-Item -ItemType Directory -Force $dir | Out-Null
    $outPath = Join-Path $outRoot ($skill.name + ".png")
    $crop = New-Object System.Drawing.Bitmap $skill.w, $skill.h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($crop)
    try {
      $graphics.Clear([System.Drawing.Color]::Transparent)
      $srcRect = New-Object System.Drawing.Rectangle $skill.x, $skill.y, $skill.w, $skill.h
      $dstRect = New-Object System.Drawing.Rectangle 0, 0, $skill.w, $skill.h
      $graphics.DrawImage($source, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    } finally {
      $graphics.Dispose()
    }
    Remove-Border-Dark $crop
    $crop.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
  }
} finally {
  $source.Dispose()
}

Write-Host "Extracted $($skills.Count) skill assets to $outRoot"
