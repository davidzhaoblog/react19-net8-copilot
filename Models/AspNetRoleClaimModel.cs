using System;
using System.Collections.Generic;

namespace AdventureWorksLT2019.Models;

public partial class AspNetRoleClaimModel
{
    public int Id { get; set; }

    public string RoleId { get; set; } = null!;

    public string? ClaimType { get; set; }

    public string? ClaimValue { get; set; }

    
}
