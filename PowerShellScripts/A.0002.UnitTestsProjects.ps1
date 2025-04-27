
# Define solution and project names
$solutionName = "AdventureWorksLT2019"
$solutionPath = "C:\Github-Blog\react19-net8-copilot"
$projects = @(
    @{ Name = "NUnitTests"; Type = "nunit"; Docker = $true },
    @{ Name = "XUnitTests"; Type = "xunit"; Docker = $true },
    @{ Name = "MSUnitTests"; Type = "mstest"; Docker = $true }
)

# Create projects and add them to the solution
foreach ($project in $projects) {
	$folderName = $project.Name
    $projectName = "$solutionName.$($project.Name)"
    dotnet new $($project.Type) -n $projectName --framework net8.0 --output $folderName
    dotnet sln add "$folderName/$projectName.csproj" --in-root 
}

# Add shared references
$sharedProjects = @("Models", "Utilities", "Shared", "RepositoriesInterfaces", "ServiceInterfaces", "EFDbContext", "MSSqlRepositories", "Services")
foreach ($consumer in $projects) {
    foreach ($shared in $sharedProjects) {
        dotnet add "$($consumer.Name)/$solutionName.$($consumer.Name).csproj" reference "$shared/$solutionName.$shared.csproj"
    }
}
