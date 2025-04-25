# Define the root directory of your project
$rootDirectory = "C:\Github-Blog\react19-net8-copilot" # Replace with the actual root directory path

# Define the source directory containing the scaffolded classes
$sourceDirectory = Join-Path -Path $rootDirectory -ChildPath "EFDbContext"

# Define the destination directory where renamed files will be placed
$destinationDirectory = Join-Path -Path $rootDirectory -ChildPath "Models"

# Ensure the destination directory exists
if (-not (Test-Path -Path $destinationDirectory)) {
    New-Item -ItemType Directory -Path $destinationDirectory
}

# Get all .cs files in the source directory, excluding the DbContext file
Get-ChildItem -Path $sourceDirectory -Filter *.cs | Where-Object {
    $_.BaseName -notlike "*DbContext"
} | ForEach-Object {
    $filePath = $_.FullName
    $fileName = $_.BaseName
    $newFileName = "$fileName" + "Model.cs"
    $newFilePath = Join-Path -Path $destinationDirectory -ChildPath $newFileName

    # Debugging: Output the file being processed
    Write-Host "Processing file: $filePath"
    Write-Host "Writing to file: $newFilePath"

    # Copy the file to the destination directory with the new name
    Copy-Item -Path $filePath -Destination $newFilePath -Force

    # Read the file content
    $content = Get-Content -Path $newFilePath

    # Update the namespace
    $content = $content -replace "namespace AdventureWorksLT2019.EFDbContext", "namespace AdventureWorksLT2019.Models"
	
    # # Update the class name
    $content = $content -replace "class $fileName", "class $fileName`Model"

    # Remove lines starting with "public virtual " and ensure end-of-line characters are removed
    $content = $content -replace "public virtual .*?(\r?\n|$)", ""

    # Debugging: Output the content after modification
    # Write-Host "Content after modification:`n$content"

    # save the updated content back to the file
    $content | set-content -path $newfilepath -encoding utf8 -force
}

