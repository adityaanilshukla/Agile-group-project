# Define the base directory path
$baseDir = "C:\SIM study base\Agile Software Projects\final\Agile-group-project"

function CreateNewTab($title, $commands) {
    $wshell.SendKeys("^+t")
    Start-Sleep -Milliseconds 500
    $wshell.SendKeys("cd `"$baseDir`"{ENTER}")  # Enclose in double quotes
    $wshell.SendKeys('$Host.UI.RawUI.WindowTitle = "' + $title + '"')
    $wshell.SendKeys("{ENTER}")
    foreach ($command in $commands) {
        $wshell.SendKeys("$command{ENTER}")
    }
    Start-Sleep -Milliseconds 500
}

# Start Windows Terminal
$wshell = New-Object -ComObject wscript.shell
$wshell.AppActivate("Windows Terminal")

# Sleep for a moment to let the Windows Terminal session start
Start-Sleep -Seconds 2

# Tab 1
$commands = @('$Host.UI.RawUI.WindowTitle = "Documentation"', 'nvim todo.md')
CreateNewTab "Documentation" $commands

# Tab 2
$commands = @('$Host.UI.RawUI.WindowTitle = "EJS"', 'cd views && nvim planning.ejs')
CreateNewTab "EJS" $commands

# Tab 3
$commands = @('$Host.UI.RawUI.WindowTitle = "JavaScript"', 'nvim index.js')
CreateNewTab "EJS" $commands

# Tab 4
$commands = @('$Host.UI.RawUI.WindowTitle = "Toucher"', clear)
CreateNewTab "Toucher" $commands

# Tab 5
$commands = @('$Host.UI.RawUI.WindowTitle = "Server"', 'nodemon index.js')
CreateNewTab "Server" $commands

# Tab 6
$commands = @('$Host.UI.RawUI.WindowTitle = "Git"', 'git log')
CreateNewTab "Git" $commands

