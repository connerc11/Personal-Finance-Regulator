# Simple PowerShell HTTP server for serving static files
$port = 3000
$path = ".\build"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Static server running at http://localhost:$port"
Write-Host "Serving files from: $path"
Write-Host "Press Ctrl+C to stop"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $requestPath = $request.Url.LocalPath
        if ($requestPath -eq "/") { $requestPath = "/index.html" }
        
        $filePath = Join-Path $path $requestPath.TrimStart('/')
        
        if (Test-Path $filePath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            
            # Set content type
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html" }
                ".js" { $response.ContentType = "application/javascript" }
                ".css" { $response.ContentType = "text/css" }
                ".json" { $response.ContentType = "application/json" }
                default { $response.ContentType = "application/octet-stream" }
            }
            
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
            $content = [System.Text.Encoding]::UTF8.GetBytes("File not found")
            $response.OutputStream.Write($content, 0, $content.Length)
        }
        
        $response.Close()
    }
} finally {
    $listener.Stop()
}
