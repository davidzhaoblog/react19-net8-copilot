
# Define solution and project names
$solutionName = "AdventureWorksLT2019"
$solutionPath = "C:\Github-Blog\react19-net8-copilot"
$projects = @(
    @{ Name = "WebApi"; Type = "webapi"; Docker = $true },
    @{ Name = "Blazor"; Type = "blazorwasm"; Docker = $true },
    @{ Name = "RazorPage"; Type = "razor"; Docker = $true },
    @{ Name = "EFDbContext"; Type = "classlib"; Docker = $false },
    @{ Name = "MSSqlRepositories"; Type = "classlib"; Docker = $false },
    @{ Name = "RepositoriesInterfaces"; Type = "classlib"; Docker = $false },
    @{ Name = "Services"; Type = "classlib"; Docker = $false },
    @{ Name = "ServiceInterfaces"; Type = "classlib"; Docker = $false },
    @{ Name = "Models"; Type = "classlib"; Docker = $false },
    @{ Name = "Utilities"; Type = "classlib"; Docker = $false },
    @{ Name = "Shared"; Type = "classlib"; Docker = $false },
    @{ Name = "HttpTriggerFunctions"; Type = "func"; Docker = $true },
    @{ Name = "TimerTriggerFunctions"; Type = "func"; Docker = $false }
)
$notFuncProjects = @(
    @{ Name = "WebApi"; Type = "webapi"; Docker = $true },
    @{ Name = "Blazor"; Type = "blazorwasm"; Docker = $true },
    @{ Name = "RazorPage"; Type = "razor"; Docker = $true },
    @{ Name = "EFDbContext"; Type = "classlib"; Docker = $false },
    @{ Name = "MSSqlRepositories"; Type = "classlib"; Docker = $false },
    @{ Name = "RepositoriesInterfaces"; Type = "classlib"; Docker = $false },
    @{ Name = "Services"; Type = "classlib"; Docker = $false },
    @{ Name = "ServiceInterfaces"; Type = "classlib"; Docker = $false },
    @{ Name = "Models"; Type = "classlib"; Docker = $false },
    @{ Name = "Utilities"; Type = "classlib"; Docker = $false },
    @{ Name = "Shared"; Type = "classlib"; Docker = $false }
)
$funcProjects = @(
    @{ Name = "HttpTriggerFunctions"; Type = "func"; Docker = $true },
    @{ Name = "TimerTriggerFunctions"; Type = "func"; Docker = $false }
)
# Create solution directory
New-Item -ItemType Directory -Path $solutionPath -Force | Out-Null
Set-Location -Path $solutionPath

# Create the solution
dotnet new sln -n $solutionName

# Create projects and add them to the solution
foreach ($project in $notFuncProjects) {
	$folderName = $project.Name
    $projectName = "$solutionName.$($project.Name)"
    dotnet new $($project.Type) -n $projectName --framework net8.0 --output $folderName
    dotnet sln add "$folderName/$projectName.csproj" --in-root 

    # Add Docker support if required
    if ($project.Docker -eq $true) {
        dotnet add "$folderName/$projectName.csproj" package Microsoft.VisualStudio.Azure.Containers.Tools.Targets
    }
}

foreach ($project in $funcProjects) {
	$folderName = $project.Name
    $projectName = "$solutionName.$($project.Name)"
    dotnet new $($project.Type) -n $projectName --output $folderName
    dotnet sln add "$folderName/$projectName.csproj" --in-root

    # Add Docker support if required
    if ($project.Docker -eq $true) {
        dotnet add "$projectName.csproj" package Microsoft.VisualStudio.Azure.Containers.Tools.Targets
    }
}

# Add project references
dotnet add "Services/$solutionName.Services.csproj" reference "ServiceInterfaces/$solutionName.ServiceInterfaces.csproj"
dotnet add "MSSqlRepositories/$solutionName.MSSqlRepositories.csproj" reference "RepositoriesInterfaces/$solutionName.RepositoriesInterfaces.csproj"
dotnet add "Services/$solutionName.Services.csproj" reference "Models/$solutionName.Models.csproj"
dotnet add "MSSqlRepositories/$solutionName.MSSqlRepositories.csproj" reference "Models/$solutionName.Models.csproj"
dotnet add "EFDbContext/$solutionName.EFDbContext.csproj" reference "Models/$solutionName.Models.csproj"

# Add shared references
$sharedProjects = @("Models", "Utilities", "Shared")
$consumerProjects = @("WebApi", "Blazor", "RazorPage", "HttpTriggerFunctions", "TimerTriggerFunctions")
foreach ($consumer in $consumerProjects) {
    foreach ($shared in $sharedProjects) {
        dotnet add "$consumer/$solutionName.$consumer.csproj" reference "$shared/$solutionName.$shared.csproj"
    }
    dotnet add "$consumer/$solutionName.$consumer.csproj" reference "Services/$solutionName.Services.csproj"
    dotnet add "$consumer/$solutionName.$consumer.csproj" reference "MSSqlRepositories/$solutionName.MSSqlRepositories.csproj"
    dotnet add "$consumer/$solutionName.$consumer.csproj" reference "EFDbContext/$solutionName.EFDbContext.csproj"
}

# Add EF Core and Microsoft Identity NuGet packages
$efCorePackages = @(
    "Microsoft.EntityFrameworkCore",
    "Microsoft.EntityFrameworkCore.SqlServer",
    "Microsoft.EntityFrameworkCore.Tools",
    "Microsoft.EntityFrameworkCore.Design"
)
$identityPackages = @(
    "Microsoft.AspNetCore.Identity.EntityFrameworkCore",
    "Microsoft.AspNetCore.Identity.UI"
)
$efCoreProjects = @("EFDbContext", "WebApi", "Blazor", "RazorPage", "HttpTriggerFunctions", "TimerTriggerFunctions")
$identityProjects = @("WebApi", "RazorPage")

foreach ($project in $efCoreProjects) {
    foreach ($package in $efCorePackages) {
        dotnet add "$project/$solutionName.$project.csproj" package $package --version 8.0.15
    }
}

foreach ($project in $identityProjects) {
    foreach ($package in $identityPackages) {
        dotnet add "$project/$solutionName.$project.csproj" package $package --version 8.0.15
    }
}
