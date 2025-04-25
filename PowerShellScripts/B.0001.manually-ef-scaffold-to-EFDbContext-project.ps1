# should goto the folder where the EFDbContext project is located. copy following script to the PowerShell console and run it.
dotnet ef dbcontext scaffold "Server=localhost;Database=AdventureWorksLT2019;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True" Microsoft.EntityFrameworkCore.SqlServer --context AdventureWorksLT2019Context

# getting following error: added "TrustServerCertificate=True"
# A connection was successfully established with the server, but then an error occurred during the login process. (provider: SSL Provider, error: 0 - The certificate chain was issued by an authority that is not trusted.)
