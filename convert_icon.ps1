Add-Type -AssemblyName System.Drawing
$image = [System.Drawing.Image]::FromFile("C:\Users\Klisman rDs\Documents\Digit-ae\app-icon.png")
$image.Save("C:\Users\Klisman rDs\Documents\Digit-ae\app-icon-real.png", [System.Drawing.Imaging.ImageFormat]::Png)
$image.Dispose()
