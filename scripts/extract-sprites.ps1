Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $root "assets\dungeonshift.png"
$outRoot = Join-Path $root "assets\sprites"

New-Item -ItemType Directory -Force $outRoot | Out-Null

$sprites = @(
  @{ name="heroes/knight_0"; x=19; y=75; w=50; h=69 },
  @{ name="heroes/knight_1"; x=81; y=75; w=51; h=69 },
  @{ name="heroes/knight_2"; x=144; y=75; w=51; h=69 },
  @{ name="heroes/knight_3"; x=20; y=173; w=51; h=69 },
  @{ name="heroes/knight_4"; x=84; y=173; w=51; h=69 },
  @{ name="heroes/knight_5"; x=145; y=173; w=52; h=69 },
  @{ name="heroes/elf_0"; x=220; y=73; w=50; h=65 },
  @{ name="heroes/elf_1"; x=284; y=73; w=52; h=65 },
  @{ name="heroes/elf_2"; x=346; y=73; w=52; h=65 },
  @{ name="heroes/elf_3"; x=221; y=166; w=50; h=65 },
  @{ name="heroes/elf_4"; x=284; y=166; w=52; h=65 },
  @{ name="heroes/elf_5"; x=346; y=166; w=52; h=65 },
  @{ name="heroes/mage_0"; x=428; y=88; w=48; h=72 },
  @{ name="heroes/mage_1"; x=516; y=88; w=48; h=72 },
  @{ name="heroes/mage_2"; x=429; y=198; w=48; h=72 },
  @{ name="heroes/mage_3"; x=516; y=198; w=48; h=72 },

  @{ name="monsters/goblin_0"; x=642; y=104; w=43; h=53 },
  @{ name="monsters/goblin_1"; x=713; y=104; w=45; h=53 },
  @{ name="monsters/goblin_2"; x=782; y=104; w=46; h=53 },
  @{ name="monsters/goblin_3"; x=642; y=184; w=43; h=53 },
  @{ name="monsters/shade_0"; x=862; y=100; w=46; h=65 },
  @{ name="monsters/shade_1"; x=930; y=100; w=45; h=65 },
  @{ name="monsters/shade_2"; x=997; y=100; w=46; h=65 },
  @{ name="monsters/brute_0"; x=1074; y=93; w=67; h=72 },
  @{ name="monsters/brute_1"; x=1160; y=93; w=70; h=72 },
  @{ name="monsters/brute_2"; x=1075; y=185; w=66; h=71 },
  @{ name="monsters/skeleton_0"; x=641; y=298; w=49; h=62 },
  @{ name="monsters/skeleton_1"; x=716; y=298; w=49; h=62 },
  @{ name="monsters/skeleton_2"; x=786; y=298; w=48; h=62 },
  @{ name="monsters/spitter_0"; x=1017; y=306; w=57; h=64 },
  @{ name="monsters/spitter_1"; x=1101; y=306; w=56; h=64 },
  @{ name="monsters/spitter_2"; x=1181; y=306; w=57; h=64 },
  @{ name="monsters/demon_0"; x=632; y=493; w=73; h=88 },
  @{ name="monsters/demon_1"; x=716; y=493; w=80; h=88 },
  @{ name="monsters/hellhound_0"; x=855; y=501; w=73; h=49 },
  @{ name="monsters/hellhound_1"; x=959; y=501; w=73; h=49 },
  @{ name="monsters/floating_eye_0"; x=642; y=684; w=57; h=62 },
  @{ name="monsters/floating_eye_1"; x=727; y=684; w=58; h=62 },
  @{ name="monsters/floating_eye_2"; x=809; y=684; w=58; h=62 },
  @{ name="monsters/bat_0"; x=856; y=690; w=63; h=43 },
  @{ name="monsters/bat_1"; x=953; y=690; w=63; h=43 },
  @{ name="monsters/bat_2"; x=872; y=735; w=65; h=43 },
  @{ name="monsters/reaper_0"; x=1083; y=681; w=65; h=94 },
  @{ name="monsters/reaper_1"; x=1160; y=681; w=70; h=94 },
  @{ name="monsters/gargoyle_0"; x=621; y=821; w=86; h=116 },
  @{ name="monsters/gargoyle_1"; x=724; y=821; w=89; h=116 },
  @{ name="monsters/dark_knight_0"; x=848; y=817; w=73; h=116 },
  @{ name="monsters/dark_knight_1"; x=950; y=817; w=75; h=116 },
  @{ name="monsters/boss_0"; x=1057; y=823; w=168; h=151 },

  @{ name="projectiles/knight"; x=24; y=407; w=85; h=62 },
  @{ name="projectiles/mage"; x=134; y=399; w=74; h=74 },
  @{ name="projectiles/elf"; x=246; y=398; w=68; h=75 },
  @{ name="projectiles/hostile"; x=526; y=849; w=66; h=89 },
  @{ name="projectiles/boss"; x=425; y=850; w=74; h=86 },
  @{ name="pickups/shard"; x=725; y=1027; w=34; h=45 },
  @{ name="pickups/xp"; x=772; y=1029; w=36; h=44 },
  @{ name="pickups/loot"; x=1011; y=1024; w=46; h=47 },
  @{ name="chests/wood"; x=623; y=1160; w=50; h=50 },
  @{ name="chests/silver"; x=690; y=1160; w=50; h=50 },
  @{ name="chests/gold"; x=754; y=1160; w=50; h=50 },
  @{ name="chests/purple"; x=774; y=1160; w=50; h=50 },
  @{ name="chests/red"; x=838; y=1160; w=58; h=50 },
  @{ name="tiles/stone_0"; x=1018; y=1136; w=43; h=40; keepBg=$true },
  @{ name="tiles/stone_1"; x=1065; y=1136; w=43; h=40; keepBg=$true },
  @{ name="tiles/grass"; x=924; y=1136; w=43; h=40; keepBg=$true },
  @{ name="tiles/lava"; x=1185; y=1136; w=43; h=40; keepBg=$true }
)

function Is-Dark([System.Drawing.Color] $c) {
  return ($c.A -gt 0 -and $c.R -lt 28 -and $c.G -lt 34 -and $c.B -lt 36)
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
  foreach ($sprite in $sprites) {
    $dir = Join-Path $outRoot (Split-Path $sprite.name -Parent)
    New-Item -ItemType Directory -Force $dir | Out-Null
    $outPath = Join-Path $outRoot ($sprite.name + ".png")
    $crop = New-Object System.Drawing.Bitmap $sprite.w, $sprite.h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($crop)
    try {
      $graphics.Clear([System.Drawing.Color]::Transparent)
      $srcRect = New-Object System.Drawing.Rectangle $sprite.x, $sprite.y, $sprite.w, $sprite.h
      $dstRect = New-Object System.Drawing.Rectangle 0, 0, $sprite.w, $sprite.h
      $graphics.DrawImage($source, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    } finally {
      $graphics.Dispose()
    }

    if (-not $sprite.keepBg) {
      Remove-Border-Dark $crop
    }

    $crop.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
  }
} finally {
  $source.Dispose()
}

Write-Host "Extracted $($sprites.Count) sprites to $outRoot"
