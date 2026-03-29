$file = "C:\Users\harin\CascadeProjects\ExponifyHermes-Merged\src\app.jsx"
$content = Get-Content $file -Raw -Encoding UTF8

# Replace ? icons with proper emojis
$content = $content -replace 'icon:"\?",title:"Agora Demographics"', 'icon:"👥",title:"Agora Demographics"'
$content = $content -replace 'icon:"\?",title:"Pythian Research"', 'icon:"🔬",title:"Pythian Research"'
$content = $content -replace 'icon:"\?",title:"Hermes AI Chatbot"', 'icon:"🤖",title:"Hermes AI Chatbot"'
$content = $content -replace 'icon:"\?",title:"Agora Social Ads"', 'icon:"📱",title:"Agora Social Ads"'
$content = $content -replace 'icon:"\?",title:"Brand-Trained Intelligence"', 'icon:"✨",title:"Brand-Trained Intelligence"'
$content = $content -replace 'icon:"\?",desc:"Scheduling', 'icon:"💆",desc:"Scheduling'

Set-Content -Path $file -Value $content -Encoding UTF8
Write-Host "Fixed ? icons in app.jsx"
