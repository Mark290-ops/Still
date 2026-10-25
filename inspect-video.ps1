Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName PresentationFramework
Add-Type -AssemblyName WindowsBase
$media = New-Object System.Windows.Media.MediaPlayer
$media.Volume = 0
$opened = New-Object System.Threading.ManualResetEventSlim($false)
$media.add_MediaOpened({ $opened.Set() })
$media.Open([Uri]'C:\Users\user\Downloads\gemini_generated_video_ac9f821f.mp4')
$media.Play()
$stopwatch = [Diagnostics.Stopwatch]::StartNew()
while (-not $opened.IsSet -and $stopwatch.Elapsed.TotalSeconds -lt 12) {
  [System.Windows.Threading.Dispatcher]::CurrentDispatcher.Invoke([Action]{}, [System.Windows.Threading.DispatcherPriority]::Background)
  Start-Sleep -Milliseconds 100
}
if (-not $opened.IsSet -or $media.NaturalVideoWidth -eq 0) { throw 'MediaPlayer did not open the video.' }
Write-Output "Duration: $($media.NaturalDuration.TimeSpan)"
$width = $media.NaturalVideoWidth
$height = $media.NaturalVideoHeight
foreach ($time in @(0.5, 2.5, 5, 7.5)) {
  $media.Position = [TimeSpan]::FromSeconds($time)
  $media.Play()
  Start-Sleep -Milliseconds 500
  [System.Windows.Threading.Dispatcher]::CurrentDispatcher.Invoke([Action]{}, [System.Windows.Threading.DispatcherPriority]::Background)
  $media.Pause()
  $visual = New-Object System.Windows.Media.DrawingVisual
  $context = $visual.RenderOpen()
  $context.DrawVideo($media, [System.Windows.Rect]::new(0, 0, $width, $height))
  $context.Close()
  $bitmap = New-Object System.Windows.Media.Imaging.RenderTargetBitmap($width,$height,96,96,[System.Windows.Media.PixelFormats]::Pbgra32)
  $bitmap.Render($visual)
  $encoder = New-Object System.Windows.Media.Imaging.PngBitmapEncoder
  $encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($bitmap))
  $output = [IO.File]::Create("C:\Users\user\Documents\Codex\2026-10-14\i\outputs\pocket-camera-concept\reference-$($time.ToString('0.0').Replace('.','-'))s.png")
  $encoder.Save($output)
  $output.Dispose()
}
$media.Close()
